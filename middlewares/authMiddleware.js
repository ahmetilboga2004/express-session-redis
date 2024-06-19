import User from "../models/User.js";

export const existUsername = async (req, res, next) => {
    try {
        const username = req.body.username;
        const user = await User.findOne({
            where: {
                username: username,
            },
        });
        if (user) {
            return res.status(400).json({
                error: "Bu kullanıcı zaten kayıtlı!",
            });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Server Error",
        });
    }
};

export const isLoggenIn = async (req, res, next) => {
    try {
        console.log(JSON.stringify(req.session));
        if (!req.session.user) {
            console.log("req.session bulunamadı maalesef");
            return res.redirect("/login");
        } else {
            console.log("oturum bulundu devam ediyoruz");
            return next();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Server Error",
        });
    }
};

export const roleControl = (...role) => {
    return (req, res, next) => {
        try {
            console.log(role);
            console.log(
                JSON.stringify(req.session) +
                    " " +
                    JSON.stringify(req.session.user) +
                    " " +
                    JSON.stringify(req.session.user.role)
            );
            if (req.session && role.includes(req.session.user.role)) {
                console.log("kullanıcı rolü doğrulandı devam edebiliriz");
                return next();
            } else {
                return res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status("500").json({
                error: "Server Error",
            });
        }
    };
};
