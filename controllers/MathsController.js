import Repository from '../models/repository.js';
import Controller from './Controller.js';
import path from 'path';
import fs from 'fs';

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
    }
    get()
    {
        if (this.HttpContext.path.queryString == "?" || this.HttpContext.path.queryString == "")
            this.help();
        else
            this.doOperation();
    }
    help()
    {
        let helpPagePath = path.join(process.cwd(), wwwroot, 'API-Help-Pages/API-Maths-Help.html');
        console.log(helpPagePath);
        this.HttpContext.response.HTML(fs.readFileSync(helpPagePath));
    }
    doOperation() {
        const params = this.HttpContext.path.params;
        let responce = {};
        let value;
        if ("op" in params) {
            let operator = params.op;
            Object.assign(responce, { "op": params.op });
            if (("x" in params && "y" in params)) {
                Object.assign(responce, { "x": params.x });
                Object.assign(responce, { "y": params.y });

                if (!(isNaN(params.x) && isNaN(params.y))) {
                    switch (operator) {
                        case " ":
                        case "+":
                            Object.assign(responce, { "value": Number(params.y) + Number(params.x) });
                            Object.assign(responce, { "op": "+" })
                            break;
                        case "-":
                            Object.assign(responce, { "value": params.x - params.y });
                            break;
                        case "*":
                            Object.assign(responce, { "value": params.x * params.y });
                            break;
                        case "/":
                            if (Number(params.y) !== 0) {
                                Object.assign(responce, { "value": params.x / params.y });
                            }
                            else {
                                if(x < 0)
                                    Object.assign(responce, { "value": "Infinity" });
                                else
                                    Object.assign(responce, { "value" : "undefined"})
                            }
                            break;
                        case "%":
                            if (Number(params.y) !== 0) {
                                Object.assign(responce, { "value": params.x % params.y });
                            }
                            else {
                                if(x < 0)
                                    Object.assign(responce, { "value": "Infinity" });
                                else
                                    Object.assign(responce, { "value" : "undefined"})
                            }
                            break;
                        default:
                            Object.assign(responce, { "error": "operator is not recognised" });
                            break;
                    }
                }
            }
            else if ("n" in params) {
                if (!isNaN(params.n)) {
                    Object.assign(responce, { "n": params.n });
                    switch (operator) {
                        case "!":
                            if (params.n >= 1) {
                                value = 1;
                                for (let i = 2; i <= n; i++) {
                                    value *= i
                                }
                                Object.assign(responce, { "value": value });
                            }
                            else {
                                Object.assign(responce, { "error": "n ne peut etre plus petit que 1" });
                            }
                            break;
                        case "p":
                            if (Number(params.n) % 1 === 0 && Number(params.n) >= 1) {
                                if (estNombrePremier(params.n))
                                    Object.assign(responce, { "value": true });
                                else
                                    Object.assign(responce, { "value": false });
                            }
                            else
                                Object.assign(responce, { "error": "n n'est pas entier ou plus petit que 1" });

                            break;
                        case "np":
                            value = niemePremier(Number(params.n));
                            if (value % 1 === 0)
                                Object.assign(responce, { "value": value });
                            else
                                Object.assign(responce, { "error": "n n'est pas un entier" });
                            break;
                        default:
                            Object.assign(responce, { "error": "Operator is not recognised" });
                            break;
                    }
                }
                else {
                    Object.assign(responce, { "error": "n is not a number" });
                }
            } else {
                Object.assign(responce, { "error": "Parameters are missing" });
            }
        } else {
            Object.assign(responce, { "error": "Operator is missing" });
        }

        this.HttpContext.response.JSON(responce);
    }
}
function estNombrePremier(nombre) {
    if (nombre <= 1) {
        return false;
    } else if (nombre <= 3) {
        return true;
    } else if (nombre % 2 === 0 || nombre % 3 === 0) {
        return false;
    }

    let i = 5;
    while (i * i <= nombre) {
        if (nombre % i === 0 || nombre % (i + 2) === 0) {
            return false;
        }
        i += 6;
    }

    return true;
}

function niemePremier(n) {
    if (n <= 0) {
        return null;
    }

    let nombre = 2;
    let i = 0;

    while (i < n) {
        if (estNombrePremier(nombre)) {
            i++;
            if (i === n) {
                return nombre;
            }
        }
        nombre++;
    }
}