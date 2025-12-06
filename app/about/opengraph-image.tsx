import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
 
// 画像のメタデータ
export const alt = 'スケジュールマネージャーアプリ'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
// 画像生成
export default async function Image() {
  const fontData = await readFile(
    join(process.cwd(), 'public', 'opengraph-image-bg.png')
  )
 
  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: 'Noto Sans JP',
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        スケジュールマネージャーアプリ
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}