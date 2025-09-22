export const EmailLogo = (
    {
        width, 
        height
    }: {
        width?: string | number, 
        height?: string | number
    }
) => 
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={width ?? 24} 
        height={height ?? 24} 
        viewBox="0 0 24 24"
    >
        <g fill="none">
            <path 
                fill="#fff" 
                d="M23.249 3.82H.75v16.36h22.5z"
            />
            <path 
                fill="#fff" 
                d="M20.999 18.136H3.001L.751 20.18H23.25z"
            />
            <path 
                stroke="#f00" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeMiterlimit="10" 
                d="M23.249 3.82L12 15.374L.751 3.819m0 16.362l8.283-7.67m5.932 0l8.283 7.67" 
                strokeWidth="1"
            />
            <path 
                stroke="#f00" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeMiterlimit="10" 
                d="M23.249 3.82H.75v16.36h22.5z" 
                strokeWidth="1"
            />
        </g>
    </svg>
