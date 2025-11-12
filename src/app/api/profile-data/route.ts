import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const file = searchParams.get('file');

    if (!type || !file) {
      return NextResponse.json(
        { error: 'Missing type or file parameter' },
        { status: 400 }
      );
    }

    // 构建文件路径
    const basePath = join(process.cwd(), '..', 'v1', 'profile');
    let filePath: string;

    // 根据类型确定正确的目录（注意许可证目录有拼写错误）
    if (type === 'license') {
      filePath = join(basePath, 'liecnse', file);
    } else if (type === 'poison') {
      filePath = join(basePath, 'poison', file);
    } else if (type === 'vuln') {
      filePath = join(basePath, 'vuln', file);
    } else {
      return NextResponse.json(
        { error: 'Invalid type parameter' },
        { status: 400 }
      );
    }

    // 读取文件
    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading profile data:', error);
    return NextResponse.json(
      { error: 'Failed to read profile data' },
      { status: 500 }
    );
  }
}