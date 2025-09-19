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

        for (let i = 2; i < rows.length; i++) { // ✅ start at 1, skip header row
            const row = rows[i];
            const cells: TableCell[] = Array.isArray(row["w:tc"])
            ? row["w:tc"]
            : [row["w:tc"]];

            const cellTexts = cells.map((tc) => {
            if (!tc["w:p"]) return "";
            const paras: Paragraph[] = Array.isArray(tc["w:p"]) ? tc["w:p"] : [tc["w:p"]];
            return paras
                .map((p) => {
                if (!p["w:r"]) return "";
                const runs = Array.isArray(p["w:r"]) ? p["w:r"] : [p["w:r"]];
                return runs.map((r) => r["w:t"] || "").join(" ");
                })
                .join(" ");
            });

            if (cellTexts.length >= 7) {
            result.push({
                courseNumber: cellTexts[0] || "",
                section: cellTexts[1] || "",
                courseDescription: cellTexts[2] || "",
                lec: cellTexts[3] || "",
                lab: cellTexts[4] || "",
                noOfStudents: cellTexts[9] || "",
                faculty: cellTexts[10] || "",
            });

            // Debugging logs
            console.log("Row:", cellTexts);
            }
        }
    }


    return result;
}
