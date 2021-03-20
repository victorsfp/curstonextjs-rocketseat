// import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Title } from '@/styles/pages/Home';
import SEO from '@/components/SEO';
import { client } from '@/lib/prismic';
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {

  //Client Side Fetching
  // const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>([]);

  // useEffect(() => {
    // fetch('http://localhost:3333/recommended').then(response => {
    //   response.json().then(data => {
    //     setRecommendedProducts(data)
    //   })
    // })
  // },[])


  async function handleSum(){
    const math = (await import('@/lib/math')).default;
    alert(math.sum(3,5))
    console.log(process.env.NEXT_PUBLIC_API_URL)
  }

  return (
    <div>
      <SEO 
        title="DevCommer, your best ecommerce!" 
        shouldExcludeTitleSuffix
        image="boost.png"
      />


      <section>
        <Title>Products</Title>
      </section>

      <ul>
        {recommendedProducts.map(recommendedProduct => {
          return (
            <li key={recommendedProduct.id}>
              <Link href={`/catalog/products/${recommendedProduct.uid}`}>
                <a>
                  { PrismicDOM.RichText.asText(recommendedProduct.data.title) }
                </a>
              </Link>
            </li>
          )
        })}
      </ul>

      <button onClick={handleSum}>Sum!</button>
    </div>
   )
}

//Server Side Rendering
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommended`);
  // const recommendedProducts = await response.json();

  // return {
  //   props: {
  //     recommendedProducts
  //   }
  // }

  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ])

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    }
  }
}