declare global {
    interface SearchData {
        query: string;
        image?: File;
        limit: number;
    }

    interface SearchContextType {
        searchData: SearchData;
        setSearchData: React.Dispatch<React.SetStateAction<SearchData>>;
        response: SearchResponse | null;
        setResponse: React.Dispatch<React.SetStateAction<SearchResponse | null>>;
    }

    interface SearchResponse {
        code: number;
        cost: number;
        data: Product[];
    }

    interface Product {
        average_rating: number;
        description: Description;
        distance: number;
        embed_image: number[];
        features: Features | null;
        id: number;
        images_large: ImageUrls;
        images_thumb: ImageUrls;
        key: number;
        main_category: string;
        parent_asin: string;
        rating_number: number;
        reviews_helpful_vote: ReviewData<IntData>;
        reviews_rating: ReviewData<FloatData>;
        reviews_text: ReviewData<StringData>;
        reviews_timestamp: ReviewData<LongData>;
        reviews_title: ReviewData<StringData>;
        reviews_verified_purchase: ReviewData<BoolData>;
        store: string;
        title: string;
    }

    interface Description {
        Data: StringData | null;
    }

    interface Features {
        Data: StringData | null;
    }

    interface ImageUrls {
        Data: {
            StringData: {
                data: string[];
            };
        };
    }

    interface StringData {
        StringData: {
            data: string[];
        };
    }

    interface FloatData {
        FloatData: {
            data: number[];
        };
    }

    interface IntData {
        IntData: {
            data: number[];
        };
    }

    interface LongData {
        LongData: {
            data: number[];
        };
    }

    interface BoolData {
        BoolData: {
            data: boolean[];
        };
    }

    interface ReviewData<T> {
        Data: T | null;
    }
}

export { };
