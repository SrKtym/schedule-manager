import { ImageResponse } from 'next/og'
 
// 画像のメタデータ
export const alt = 'スケジュールマネージャーアプリ'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
// 画像生成
export default async function Image() {
  const fontData = await fetch(
    new URL("./Inter-SemiBold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());
 
  return new ImageResponse(
    (
      <div
        style={{
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
          name: 'Inter',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}