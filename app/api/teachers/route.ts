import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET(){
    const teachers = await prisma.teachers.findMany();

    //get many but condition
    // const teachers = await prisma.teachers.findMany({
    //     where:{
    //         teacher_id:  1
    //     },
    // });
    
    return NextResponse.json(teachers);
}