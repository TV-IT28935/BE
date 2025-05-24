import { matrix, dot, subset, index, zeros, range } from "mathjs";
import { errorResponse400 } from "../utils/responseHandler.js";
import Product from "../model/product.js";
import Attribute from "../model/attribute.js";
import Sale from "../model/sale.js";
import Brand from "../model/brand.js";
import Image from "../model/image.js";

const combineFeatures = ({ code, name, description }) =>
    `${code} ${name} ${description}`;

const calculateTfIdf = async (featuresList) => {
    const documentFrequency = new Map();
    const termFrequencyList = [];

    featuresList.forEach((features) => {
        const terms = features
            .toLowerCase()
            .split(/\s+/)
            .filter((term) => term);
        const termFrequency = new Map();
        const uniqueTerms = new Set();

        terms.forEach((term) => {
            termFrequency.set(term, (termFrequency.get(term) || 0) + 1);
            uniqueTerms.add(term) &&
                documentFrequency.set(
                    term,
                    (documentFrequency.get(term) || 0) + 1
                );
        });

        termFrequencyList.push(termFrequency);
    });

    const totalDocs = featuresList.length;
    const tfidfMatrix = termFrequencyList.map((termFrequency) => {
        const tfidf = new Map();
        for (const [term, tf] of termFrequency) {
            const df = documentFrequency.get(term) || 0;
            const idf = Math.log(totalDocs / (df + 1));
            tfidf.set(term, tf * idf);
        }
        return tfidf;
    });

    return tfidfMatrix;
};

const calculateCosineSimilarity = (tfidfMatrix) => {
    const allTerms = new Set(tfidfMatrix.flatMap((tfidf) => [...tfidf.keys()]));

    const tfidfVectors = tfidfMatrix.map((tfidf) =>
        [...allTerms].map((term) => tfidf.get(term) || 0)
    );

    const mat = matrix(tfidfVectors);
    const rowCount = mat.size()[0];
    const colCount = mat.size()[1];
    const similarityMatrix = zeros(rowCount, rowCount).toArray();

    for (let i = 0; i < rowCount; i++) {
        const vecI = mat.subset(index(i, range(0, colCount))).toArray()[0];
        for (let j = 0; j < rowCount; j++) {
            const vecJ = mat.subset(index(j, range(0, colCount))).toArray()[0];
            similarityMatrix[i][j] = cosineValueSimilarity(vecI, vecJ);
        }
    }

    return similarityMatrix;
};

const cosineValueSimilarity = (vector1, vector2) => {
    const dotProduct = dot(vector1, vector2);
    const normA = Math.sqrt(dot(vector1, vector1));
    const normB = Math.sqrt(dot(vector2, vector2));
    const result = dotProduct / (normA * normB);
    return isNaN(result) ? 0 : Math.round(result * 1000) / 1000;
};

const getRecommendationsService = async (productId, page = 1, limit = 10) => {
    const product = await Product.findOne({
        _id: productId,
    });
    if (!product) {
        return errorResponse400({
            message: "Không tìm thấy sản phẩm!",
            status: false,
        });
    }

    console.log(product, "productxx");

    const products = await Product.find({}).sort({ _id: 1 });
    const featuresList = products.map((product) =>
        combineFeatures({
            code: product.code,
            name: product.name,
            description: product.description,
        })
    );

    const tfidfMatrix = await calculateTfIdf(featuresList);
    console.log(tfidfMatrix, "xxxxxxxxxxxxxxxxx");
    const similarityMatrix = calculateCosineSimilarity(tfidfMatrix);

    console.log(similarityMatrix, "xxxxxxxxxxxxyyyyyyy");

    const indexProduct = products.findIndex(
        (p) => p._id.toString() === productId.toString()
    );
    if (indexProduct === -1)
        throw new Error("Product not found in sorted list");

    const similarProducts = new Map(
        similarityMatrix[indexProduct].map((score, i) => [i, score])
    );

    const sortedProductIndices = [...similarProducts.entries()]
        .sort(([_, scoreA], [__, scoreB]) => scoreB - scoreA)
        .map(([index]) => index);

    const productList = [];
    const productSimilarityMap = new Map();
    for (let i = 1; i < Math.min(4, sortedProductIndices.length); i++) {
        const product = products[sortedProductIndices[i]];
        const cosineValue = similarProducts.get(sortedProductIndices[i]);
        productList.push(product);
        productSimilarityMap.set(product._id.toString(), cosineValue);
    }

    const startIndex = (page - 1) * limit;
    const paginatedProducts = productList.slice(startIndex, startIndex + limit);
    const total = productList.length;

    const productIds = paginatedProducts.map((p) => p._id);
    const [attributes, brands, sales, images] = await Promise.all([
        Attribute.find({ productId: { $in: productIds } }),
        Brand.find({ _id: { $in: paginatedProducts.map((p) => p.brand) } }),
        Sale.find({ _id: { $in: paginatedProducts.map((p) => p.sale) } }),
        Image.find({ productId: { $in: productIds }, name: "main" }),
    ]);

    const attributeMap = new Map(
        attributes.map((attr) => [attr?.productId.toString(), attr])
    );
    const brandMap = new Map(brands.map((b) => [b._id.toString(), b]));
    const saleMap = new Map(sales.map((s) => [s._id.toString(), s]));
    const imageMap = new Map(
        images.map((img) => [img?.productId.toString(), img])
    );

    const productDtos = paginatedProducts.map(
        ({
            _id: id,
            name,
            code,
            view,
            description,
            brandId,
            saleId,
            isActive,
        }) => ({
            id,
            name,
            price: attributeMap.get(id.toString())?.price ?? 0,
            brand: brandMap.get(brandId.toString())?.name ?? "",
            code,
            view,
            description,
            image: imageMap.get(id.toString())?.imageLink ?? "",
            discount: saleMap.get(saleId.toString())?.discount ?? 0,
            isActive,
            liked: false,
            similarity: productSimilarityMap.get(id.toString()) ?? 0,
        })
    );

    return {
        data: productDtos,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export default getRecommendationsService;
