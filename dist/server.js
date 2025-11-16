"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const test_routes_1 = __importDefault(require("./routes/test.routes"));
dotenv_1.default.config();
const PORT = process.env.PORT;
app_1.default.get('/', (req, res) => {
    res.json({ response: 'Server health is ok !' });
});
app_1.default.use('/api', test_routes_1.default);
try {
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
catch (error) {
    console.error('Error starting the server:', error);
}
