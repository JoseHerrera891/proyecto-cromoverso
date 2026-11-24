// Verifica el criterio 3 de US-CRO-S1-01: ningún componente usa colores ni
// medidas en px escritos a mano. Los valores solo viven en src/styles/tokens.css.
// Se permiten px dentro de @media (las variables CSS no funcionan ahí).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const RAIZ = "src";
const PERMITIDOS = new Set(["src/styles/tokens.css"]);
const PATRON = /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|(?<![\w.-])\d*\.?\d+px\b/gi;

function archivosCss(dir) {
  return readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) return archivosCss(ruta);
    return ruta.endsWith(".css") ? [ruta] : [];
  });
}

const errores = [];
for (const archivo of archivosCss(RAIZ)) {
  const ruta = relative(".", archivo).replaceAll("\\", "/");
  if (PERMITIDOS.has(ruta)) continue;
  readFileSync(archivo, "utf8")
    .split("\n")
    .forEach((linea, i) => {
      if (linea.trim().startsWith("@media")) return;
      const sinComentarios = linea.replace(/\/\*.*?\*\//g, "");
      const hallazgos = sinComentarios.match(PATRON);
      if (hallazgos) errores.push(`${ruta}:${i + 1}  ${hallazgos.join(", ")}`);
    });
}

if (errores.length) {
  console.error("Valores escritos a mano fuera de tokens.css:\n");
  console.error(errores.join("\n"));
  process.exit(1);
}
console.log("Sin valores escritos a mano: todos los estilos usan tokens.");
