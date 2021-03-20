import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import Prismic from 'prismic-javascript';
import { client } from "@/lib/prismic";
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';


interface ProductProps {
    product: Document;
}


const AddToCartModal = dynamic(
    () => import('@/components/AddToCartToModal'),
    {
        loading: () => <p>Loagin...</p>,
        ssr: false
    }
)

export default function Product({ product }: ProductProps){
    const router = useRouter();
    const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

    function handleAddToCart(){
        setIsAddToCartModalVisible(true)
    }

    if(router.isFallback){
        return <p>Carregando...</p>
    }


    return(
        <div>
            <h1>
            { PrismicDOM.RichText.asText(product.data.title) }
            </h1>

            <img src={product.data.thumbmail.url} width="300" alt=""/>

            <div dangerouslySetInnerHTML={{ __html: PrismicDOM.RichText.asHtml(product.data.description) }}></div>


            <p>Price: ${product.data.price}</p>
            


            <br/>
            <button onClick={handleAddToCart}>Add to cart</button>

            { isAddToCartModalVisible && <AddToCartModal />} 
        </div>
    )
}


export const getStaticPaths: GetStaticPaths = async () => {

    return {
        paths: [],
        fallback: true //SEMPRE QUE O USUÁRIO ACESSAR UMA RODA QUE NAO FOI GERADO, TENTARA GERAR AUTOMATICAMENTE
    }
}

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
    const { slug } = context.params;

    const product = await client().getByUID('product', String(slug), {});

    
    // const response = await fetch(`http://localhost:3333/products?category_id=${slug}`);
    // const products = await response.json();

    return {
        props:{
            product
        },
        revalidate: 60 //a cada 5 sengundos ele ira atualizar
    }
}