import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 });
    }

    // 构建SBOM数据文件路径
    const sbomDataPath = path.join(process.cwd(), '..', 'v1', 'sbom', file);

    // 检查文件是否存在
    if (!fs.existsSync(sbomDataPath)) {
      return NextResponse.json({ error: 'SBOM data file not found' }, { status: 404 });
    }

    // 读取文件内容
    const fileContent = fs.readFileSync(sbomDataPath, 'utf-8');
    const sbomData = JSON.parse(fileContent);

    return NextResponse.json(sbomData);
  } catch (error) {
    console.error('Error reading SBOM data:', error);
    return NextResponse.json({ error: 'Failed to read SBOM data' }, { status: 500 });
  }
}