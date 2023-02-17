import { StartGG } from "./jsstartgg/startgg.js";
import {
    config
} from "dotenv";
config()

const api = new StartGG(process.env.KEY);