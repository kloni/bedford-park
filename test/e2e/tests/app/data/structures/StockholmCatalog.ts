export interface StockholmCatalog {
    Bath: {
        categoryName: string,
        Lighting : {},
        Fixtures : {},
        Accessories: {
            subCategoryName: string,
            "Makeup Mirror": {
                productInfo: StockholmProduct
                "BR-ACCE-0001-0001": Sku
            },
            "Bender Toothbrush Holder": {
                productInfo: StockholmProduct
                "BR-ACCE-0002-0001": Sku
            },
            "Kerry\"s Glass Soap Dispenser": {
                productInfo: StockholmProduct
                "BR-ACCE-0003-0001": Sku
            },
        }
    },
    Bedroom: {
        categoryName: string,
        Dressers: {
            subCategoryName: string,
            "Style Home Large Ash Wood Chest of Drawers": {
                productInfo: StockholmProduct,
                "BD-DRSS-0001-0001": Sku,
                "BD-DRSS-0001-0002": Sku,
                "BD-DRSS-0001-0003": Sku,
            },
            "Stonehenge Clodit Chest of Drawers": {
                productInfo: StockholmProduct,
                "BD-DRSS-0002-0001": Sku,
                "BD-DRSS-0002-0002": Sku,
                "BD-DRSS-0002-0003": Sku,
                "BD-DRSS-0002-0004": Sku
            },
            "Style Home Intree Chest of Drawers": {
                productInfo: StockholmProduct,
                "BD-DRSS-0003-0001": Sku,
                "BD-DRSS-0003-0002": Sku,
                "BD-DRSS-0003-0003": Sku,
                "BD-DRSS-0003-0004": Sku
            },
            "Stonehenge Large Elegant Wardrobe": {
                productInfo: StockholmProduct,
                "BD-DRSS-0004-0001": Sku,
                "BD-DRSS-0004-0002": Sku,
                "BD-DRSS-0004-0003": Sku,
            }
        }
    }
    LivingRoom: {
        categoryName: string,
        LivingRoomFurniture: {
            subCategoryName: string,
            "Wooden Angled Chair": {
                productInfo: StockholmProduct
            },
            "Supreme LoungeStyle Double Sofa": {
                productInfo: StockholmProduct
            },
            "Modern Armchair" : {
                productInfo : StockholmProduct,
                "LR-FUCH-0001-0001" : Sku
            },
            "Casual Armchair" : {
                productInfo : StockholmProduct,
                "LR-FUCH-0002-0001" : Sku
            },
            "Soft Vintage Armchair" : {
                productInfo : StockholmProduct,
                "LR-FUCH-0003-0001" : Sku
            },
            "Nordic Loveseat": {
                productInfo: StockholmProduct,
                "LR-FUCH-0005-0001": Sku,
                "LR-FUCH-0005-0005": Sku
            },
            "Nordic Sofa": {
                productInfo: StockholmProduct,
                "LR-FUCH-0004-0001": Sku,
                "LR-FUCH-0004-0005": Sku
            },
            "Nordic Style": {
                productInfo: StockholmProduct
            },
            "Nordic Sofa Set": {
                productInfo: StockholmProduct
            }
            "StyleHome InOffice Double Sofa" : {
                productInfo : StockholmProduct,
                "LR-FNTR-0003-0001" : Sku
            },
            "Casual Sofa" : {
                productInfo : StockholmProduct,
                "LR-FNTR-CO-0006-0004" : Sku
            },
            "Supreme Rocoz Vintage Sofa Chair" : {
                productInfo : StockholmProduct,
                "LR-FNTR-0003-0001" : Sku
            },
            "Plump Leather Sofa" : {
                productInfo : StockholmProduct,
                "LR-FNTR-CO-0004-0001" : Sku
            },
            "Flared Accent Chair" : {
                productInfo : StockholmProduct,
                "LR-FNTR-0002-0002" : Sku,
                "LR-FNTR-0002-0003" : Sku
            },
            "Floating Sofa" : {
                productInfo : StockholmProduct,
                "LR-FNTR-CO-0009-0001" : Sku
            },
            "Stonehenge UltraCozy Single Sofa":{
                productInfo : StockholmProduct,
                "LR-FNTR-0004-0001" : Sku
            },
            "Abstract Wooden Coffee Table":{
                productInfo : StockholmProduct,
                "LR-FNTR-TB-0001-0003" : Sku
            },
            "Soft Plush Sofa":{
                productInfo : StockholmProduct,
                "LR-FNTR-CO-0007-0001" : Sku
            },
            "StyleHome Modern Plain Single Large Sofa":{
                productInfo : StockholmProduct,
                "LR-FNTR-CO-0001-0001" : Sku
            }

        },
        LivingRoomLighting: {
            subCategoryName: string,
            "Modern Pendant Light": {
                productInfo: StockholmProduct,
                "LR-LITB-0001-0001": Sku
            },
            "Nordic Lamp": {
                productInfo: StockholmProduct,
                "LR-LITB-0008-0001": Sku
            }
        }
        Decoration: {
            subCategoryName: string,
            "x": {
                productInfo: StockholmProduct,
                "x": Sku
            }
        }
    }
}

export interface StockholmProduct {
    name: string
    productCode: string
    shortDescription: string
    longDescription: string
    descriptiveAttributes: {}
    minPrice: string,
    maxPrice: string
}

export interface Bundle {
    bundleName: string,
    bundleSku: string,
    bundleShortDescription: string,
    bundleLongDescription: string,
    slideImages : string[],
    bundlePrice: number,
    bundleProducts : string[];
  }

export interface Sku {
    sku: string,
    priceList: number,
    priceOffering: number,
    imageFull: string,
    imageThumbnail: string,
    slideImages?: string[],
    attributes: {}
}