import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

// getServerSidePropsから渡されるpropsの型
type Props = {
    initialImageUrl: string;
};

// ページコンポーネント関数にpropsを受け取る引数を追加する
const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
      // ❶ useStateを使って状態を定義する
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [loading, setLoading] = useState(false);


    // 以下、CSRで画像を取得するための処理
// // ❷ マウント時に画像を読み込む宣言
// //Reactの useEffect は、**「ある処理をいつ実行するか」**を決めるための関数です。
//     useEffect(() => {
//         //この中の処理は、ページが表示されたとき（マウント時）に1回だけ実行されます
//         fetchImage().then((newImage) => {
//             setImageUrl(newImage.url);// 画像URLの状態を更新する
//             setLoading(false);// ローディング状態を更新する
//         });
//     }, []);


    //ボタンをクリックしたときに画像を読み込む
    const handleClick = async () => {
        setLoading(true);// 読込中フラグを立てる
        const newImage = await fetchImage();// 画像URLの状態を更新する
        setImageUrl(newImage.url);// 画像URLの状態を更新する
        setLoading(false);// 読込中フラグを倒す
    };

      // ❸ ローディング中でなければ、画像を表示する
    return ( 
        <div>
            <button onClick={handleClick}>One more cat!</button>
            <div>{loading ? <p>読み込み中...</p> : <img src={imageUrl} alt="猫の画像" />}</div>
        </div>
    );
};

export default IndexPage;

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const image = await fetchImage();
    return {
        props: {
            initialImageUrl: image.url,
        },
    };
};



type Image = {
    url: string;
};

const fetchImage = async (): Promise<Image> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images = await res.json();
    console.log(images);
    return images[0];
};

// fetchImage();