export default generatePassword = (l = 12) =>
    [...Array(l)]
        .map(
            () =>
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"[
                    Math.floor(Math.random() * 72)
                ]
        )
        .join("");
