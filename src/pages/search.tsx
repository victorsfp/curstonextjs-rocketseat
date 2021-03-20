import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from 'next/link';

import { FormEvent, useState } from "react";
import Prismic from 'prismic-javascript';
import { client } from "@/lib/prismic";
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

interface SearchProps {
    searchReults: Document[]
}

export default function Search({ searchReults }: SearchProps){
    const router = useRouter();

    const [search, setSearch] = useState('')

    function handleSearch(e: FormEvent){
        e.preventDefault();

        router.push(`
            /search?q=${encodeURIComponent(search)}
        `)

        setSearch('')
    }

    return(
        <div>
            <form onSubmit={handleSearch}>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>
                <button type="submit">Search</button>
            </form>


            <ul>
                {searchReults.map(product => {
                return (
                    <li key={product.id}>
                    <Link href={`/catalog/products/${product.uid}`}>
                        <a>
                        { PrismicDOM.RichText.asText(product.data.title) }
                        </a>
                    </Link>
                    </li>
                )
                })}
            </ul>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {
    const { q } = context.query;

    if(!q){
        return {
            props: {
                searchReults: []
            }
        }
    }

    const searchReults = await client().query([
        Prismic.Predicates.at('document.type', 'product'),
        Prismic.Predicates.fulltext('my.product.title', String(q))
    ])

    return {
        props: {
            searchReults: searchReults.results
        }
    }
}