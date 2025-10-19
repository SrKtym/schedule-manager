'use client';

export function BackToTopButton() {
    return (
        <button
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className="w-full text-white bg-gray-500 px-3 py-2 cursor-pointer"
        >
            トップへ戻る
        </button>
    );
}