import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { DocuInfo } from "@/models/documentInfo";

export async function parseDocx(file: File): Promise<DocuInfo[]> {
    const buffer = await file.arrayBuffer();

    // Load docx as zip
    const zip = await JSZip.loadAsync(buffer);
    const xml = await zip.file("word/document.xml")?.async("text");
    if (!xml) throw new Error("document.xml not found in docx");

    // Parse XML
    const parser = new XMLParser({ ignoreAttributes: false });
    const json = parser.parse(xml) as {
        ["w:document"]: {
        ["w:body"]: {
            ["w:tbl"]?: Table | Table[];
        };
        };
    };

    type Paragraph = {
        ["w:r"]?: { ["w:t"]?: string } | { ["w:t"]?: string }[];
    };

    type TableCell = {
        ["w:p"]?: Paragraph | Paragraph[];
    };

    type TableRow = {
        ["w:tc"]: TableCell | TableCell[];
    };

    type Table = {
        ["w:tr"]: TableRow | TableRow[];
    };

    const body = json["w:document"]["w:body"];
    const tables: Table[] = body["w:tbl"]
        ? Array.isArray(body["w:tbl"]) ? body["w:tbl"] : [body["w:tbl"]]
        : [];

    const result: DocuInfo[] = [];

    for (const table of tables) {
        const rows: TableRow[] = Array.isArray(table["w:tr"])
            ? table["w:tr"]
            : [table["w:tr"]];

        for (let i = 2; i < rows.length; i++) {
            const row = rows[i];
            const cells: TableCell[] = Array.isArray(row["w:tc"]) ? row["w:tc"] : [row["w:tc"]];

            // Extract lec and lab separately using the simple version
            const lecCell = cells[3];
            const labCell = cells[4];
            const noOfStudentCell = cells[9];

            const lec = lecCell && lecCell["w:p"]
                ? (Array.isArray(lecCell["w:p"]) ? lecCell["w:p"] : [lecCell["w:p"]])
                    .map(p => {
                        if (!p["w:r"]) return "";
                        const runs = Array.isArray(p["w:r"]) ? p["w:r"] : [p["w:r"]];
                        return runs.map(r => r["w:t"] || "").join("");
                    })
                    .join(" ")
                : "0";

            const lab = labCell && labCell["w:p"]
                ? (Array.isArray(labCell["w:p"]) ? labCell["w:p"] : [labCell["w:p"]])
                    .map(p => {
                        if (!p["w:r"]) return "";
                        const runs = Array.isArray(p["w:r"]) ? p["w:r"] : [p["w:r"]];
                        return runs.map(r => r["w:t"] || "").join("");
                    })
                    .join(" ")
                : "0";
            
            const noOfStudents = noOfStudentCell && noOfStudentCell["w:p"]
                ? (Array.isArray(noOfStudentCell["w:p"]) ? noOfStudentCell["w:p"] : [noOfStudentCell["w:p"]])
                    .map(p => {
                        if (!p["w:r"]) return "";
                        const runs = Array.isArray(p["w:r"]) ? p["w:r"] : [p["w:r"]];
                        return runs.map(r => r["w:t"] || "").join("");
                    })
                    .join(" ")
                : "0";

            // Extract other cells using normalizeText
            const cellTexts = cells.map((tc, idx) => {
                // Skip lec and lab, since its already handled 
                if (idx === 3 || idx === 4) return "";
                if (!tc["w:p"]) return "";
                const paras: Paragraph[] = Array.isArray(tc["w:p"]) ? tc["w:p"] : [tc["w:p"]];
                return paras
                    .map((p) => {
                        if (!p["w:r"]) return "";
                        const runs = Array.isArray(p["w:r"]) ? p["w:r"] : [p["w:r"]];
                        return runs.map((r) => normalizeText(r["w:t"])).join(" ");
                    })
                    .join(" ")
                    .trim();
            });

            if (cellTexts.length >= 11) {
                result.push({
                    courseNumber: cellTexts[0] || "",
                    section: cellTexts[1] || "",
                    courseDescription: cellTexts[2] || "",
                    lec: lec || "0",
                    lab: lab || "0",
                    noOfStudents: noOfStudents || "0",
                    faculty: cellTexts[10] || "",
                });

                console.log("Lec:", lec);
                console.log("Lab:", lab);
                console.log("Row:", cellTexts);
            }
        }


    }


    return result;
}

function normalizeText(textNode: unknown): string {
    if (!textNode) return "";

    if (typeof textNode === "string") return textNode;

    if (Array.isArray(textNode)) {
        return textNode.map(normalizeText).join("");
    }

    if (typeof textNode === "object" && textNode !== null) {
        const obj = textNode as Record<string, unknown>;
        if ("#text" in obj && typeof obj["#text"] === "string") {
        return obj["#text"];
        }
        // Flatten any other nested values
        return Object.values(obj).map(normalizeText).join("");
    }

    return "";
}
