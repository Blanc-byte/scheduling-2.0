export interface DocuInfo{
    courseNumber: string;
    courseDescription: string;
    section: string;
    lec: string;
    lab: string;
    noOfStudents: string;
    faculty:string;
}


export function setDocxData(data: DocuInfo[]) {
    localStorage.removeItem("docxData");
    localStorage.setItem("docxData", JSON.stringify(data));
}

export function getDocxData(): DocuInfo[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("docxData");
    return stored ? JSON.parse(stored) : [];
  }
  return [];
}

