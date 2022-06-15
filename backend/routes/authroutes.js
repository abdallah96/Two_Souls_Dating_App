const usermodel = require("../models/usermodel");

module.exports = function(app) {
    const maxAge = 3 * 24 * 60 * 60;
    const jwt = require("jsonwebtoken");
    const createToken = (id) => {
    return jwt.sign({ id }, "smrutipuranikkey", {
        expiresIn: maxAge,
    });
};
const handleErrors = (err) => {
    let errors = { email: "", password: "" };

    if (err.message === "Incorrect email")
        errors.email = "This email is not registered";

    if (err.message === "Incorrect password")
        errors.email = "This password is incorrect";

    if (err.code === 11000) {
        errors.email = "Email is already registered";
        return errors;
    }

    if (err.message.includes("Users validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};
    app.post('/api/register', async(req, res) => {
        
        try {
        const { email, password } = req.body.userData;
        const user = await usermodel.create({ email, password });
        //after user is created
        const token = createToken(user._id);
        res.cookie("jwt", token, {
            withCredentials: true,
            httpOnly: false, //will be passed from another domain or port
            maxAge: maxAge * 1000,
        });
        res.cookie("userid", email);
        res.cookie("isAdmin", false);
        res.status(201).json({ user: user._id, created: true });
            } catch (err) {
                console.log(err);
                const errors = handleErrors(err);
                res.json({ errors, created: false });
            }
    });
    app.post('/api/registeradmin', async(req, res) => {
        
        try {
        const { email, password, isAdmin } = req.body.userData;
        const user = await usermodel.create({ email, password, isAdmin });
        //after user is created
        res.send("Admin added");
            } catch (err) {
                console.log(err);
                const errors = handleErrors(err);
                res.json({ errors, created: false });
            }
    });
    app.post('/api/signin', async(req, res) => {
        try {
            
            const { email, password } = req.body.userData;
            const user = await usermodel.signin(email, password);
            //after user is created
            const token = createToken(user._id);
            res.cookie("jwt", token, {
                withCredentials: true,
                httpOnly: false, //will be passed from another domain or port
                maxAge: maxAge * 1000,
            });
            res.cookie("userid", email);
            res.cookie("isAdmin", user.isAdmin);
            res.status(200).json({ user: user._id, created: true, isAdmin: user.isAdmin });
        } catch (err) {
            console.log(err);
            const errors = handleErrors(err);
            res.json({ errors, created: false });
        }
    });
    app.post('/', async(req, res) => {
        const token = req.body.cookies.jwt;
    if (token) {
        jwt.verify(token, "smrutipuranikkey", async(err, decodedToken) => {
            if (err) {
                res.json({ status: false });
            } else {
                const user = await usermodel.findById(decodedToken.id);
                if (user) res.json({ status: true, user: user.email });
                else res.json({ status: false });
            }
        });
    } else {
        res.json({ status: false });
        next();
    }
    });
};

