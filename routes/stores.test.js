"use strict";

const request = require("supertest");
const app = require("../app");

const {
  commonAfterAll,
  commonBeforeAll,
  ownerTwoToken,
  ownerToken,
} = require("../models/_testCommon");

beforeAll(commonBeforeAll);
afterAll(commonAfterAll);

// ******************************** POST /stores/:ownerId **************************************

describe("POST /stores/:ownerId", function () {
  test("works for correct owner", async function () {
    const storeData = {
      storeName: "test_store_two",
      logo: "http//:testlogo",
      theme: "TestTheme",
      siteFont: "TestFont",
    };
    const res = await request(app)
      .post("/stores/2")
      .send(storeData)
      .set("authorization", `Bearer ${ownerTwoToken}`);
    expect(res.body).toEqual({ store: [{ storeId: 2 }] });
  });

  test("unauth for incorrect owner", async function () {
    const storeData = {
      storeName: "test_store_two",
      logo: "http//:testlogo",
      theme: "TestTheme",
      siteFont: "TestFont",
    };
    const res = await request(app)
      .post("/stores/2")
      .send(storeData)
      .set("authorization", `Bearer ${ownerToken}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const storeData = {
      storeName: "test_store_two",
      logo: "http//:testlogo",
      theme: "TestTheme",
      siteFont: "TestFont",
    };
    const res = await request(app).post("/stores/2").send(storeData);
    expect(res.statusCode).toEqual(401);
  });
});

// ******************************** GET /stores/:ownerId ******************************************

describe("GET /stores/:ownerId", function () {
  test("works", async function () {
    const res = await request(app)
      .get(`/stores/1`)
    expect(res.body.store.storeName).toEqual('test_store');
  });

});

// ************************************** PUT /stores/ownerId ************************************

describe("PUT /stores/:ownerId", function () {
  test("works for correct owner", async function () {
    const updatedStoreData = {
      storeName: "test_store_twoUPDATE",
      logo: "http//:testlogoUPDATE",
      theme: "TestThemeUPDATE",
      siteFont: "TestFont",
    };
    const res = await request(app)
      .put(`/stores/1`)
      .send(updatedStoreData)
      .set("authorization", `Bearer ${ownerToken}`);
      expect(res.body).toEqual(   {
        updatedStore: {
          store_name: 'test_store_twoUPDATE',
          id: 1,
          site_font: 'TestFont',
          logo: 'http//:testlogoUPDATE',
          theme: 'TestThemeUPDATE'
        }
      })

  });

  test("unauth if not correct owner", async function () {
    const res = await request(app)
      .put(`/stores/1`)
      .set("authorization", `Bearer ${ownerTwoToken}`);
    expect(res.statusCode).toEqual(401);
  });
});

// **************************************** DELETE /stores/:ownerId ********************************

describe("DELETE /stores/:ownerId", function () {
  test("works for correct owner", async function () {
    const res = await request(app)
      .delete(`/stores/2`)
      .set("authorization", `Bearer ${ownerTwoToken}`);
    expect(res.body).toEqual({ deleted: "2" });
  });

  test("unauth if wrong owner", async function () {
    const res = await request(app)
      .delete(`/stores/1`)
      .set("authorization", `Bearer ${ownerTwoToken}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const res = await request(app).delete(`/stores/1`);
    expect(res.statusCode).toEqual(401);
  });
});

// ******************************** POST /stores/:ownerId/categories/:storeId *********************

describe("POST /stores/:ownerId/categories/:storeId", function () {
  test("works with correct owner", async function () {
     const res = await request(app) 
     .post(`/stores/1/categories/1`)
     .send({categoryName: "TestCategoryTwo"})
     .set("authorization", `Bearer ${ownerToken}`)
     expect(res.body).toEqual({ category: [ { categoryId: 2 } ] })
  })

  test("fails with incorrect owner", async function () {
     const res = await request(app) 
     .post(`/stores/1/categories/1`)
     .send({categoryName: "TestCategoryTwo"})
     .set("authorization", `Bearer ${ownerTwoToken}`)
     expect(res.statusCode).toEqual(401)
  })
})

// ******************************** GET /stores/:ownerId/categories/:categoryId **************************


describe("GET /stores/:ownerId/categories/:categoryId", function () {
  test("works", async function () {
    const res = await request(app)
      .get(`/stores/1/categories/1`)
    expect(res.body.category.categoryName).toEqual("testCategory")
  });

});

// ******************************** GET /stores/:ownerId/categories/all/:storeId ****************

describe("GET /stores/:ownerId/categories/all/:storeId", function () {
  test("works", async function () {
    const res = await request(app)
      .get(`/stores/1/categories/all/1`)
      expect(res.body.categories.length).toEqual(2)
  });

});

// **************************************** PUT /stores/:ownerId/categories/:categoryId *********************

describe("PUT /stores/:ownerId/categories/:categoryId", function () {
  test("works for correct owner", async function () {
    const res = await request(app)
      .put(`/stores/1/categories/2`)
      .send({categoryName: "UpdatedCategoryTwo"})
      .set("authorization", `Bearer ${ownerToken}`);
      expect(res.body).toEqual({ updatedCategory: { category_name: 'UpdatedCategoryTwo' } })

  });

  test("unauth if not correct owner", async function () {
    const res = await request(app)
      .put(`/stores/1/categories/2`)
      .set("authorization", `Bearer ${ownerTwoToken}`);
    expect(res.statusCode).toEqual(401);
  });
});

// ******************************** DELETE /stores/:ownerId/categories/:categoryId *******************

describe("DELETE /stores/:ownerId/categories/:categoryId", function () {
  test("works for correct owner", async function () {
    const res = await request(app)
      .delete(`/stores/1/categories/2`)
      .set("authorization", `Bearer ${ownerToken}`);
    expect(res.body).toEqual({ deleted: "1" });
  });

  test("unauth if wrong owner", async function () {
    const res = await request(app)
      .delete(`/stores/1/categories/2`)
      .set("authorization", `Bearer ${ownerTwoToken}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const res = await request(app).delete(`/stores/1/categories/2`);
    expect(res.statusCode).toEqual(401);
  });
});

// ********************************** POST /stores/:ownerId/products/storeId *************************

describe("POST /stores/:ownerId/products/:storeId", function () {
  test("works with correct owner", async function () {
     const res = await request(app) 
     .post(`/stores/1/products/1`)
     .send(  {
      categoryName: 'testCategory',
      productName: "testProductThree",
      brand: "testBrand",
      productDescription: "testProductTwoDescpription",
      image: "testImageTwo",
      price: "20",
      qty: "20"
    },)
     .set("authorization", `Bearer ${ownerToken}`)
     expect(res.body).toEqual({ product: { id: 3 } });
  })

  test("fails with incorrect owner", async function () {
     const res = await request(app) 
     .post(`/stores/1/products/1`)
     .send(  {
      categoryName: 'testCategory',
      productName: "testProductThree",
      brand: "testBrand",
      productDescription: "testProductTwoDescpription",
      image: "testImageTwo",
      price: '20',
      qty: '20'
    },)
     .set("authorization", `Bearer ${ownerTwoToken}`)
     expect(res.statusCode).toEqual(401)
  })
})

// ************************************ GET /stores/:ownerId/products/:storeId **********************

describe("GET /stores/:ownerId/producs/:productId", function () {
  test("works for any user", async function () {
    const res = await request(app)
      .get(`/stores/1/products/1`)
       expect(res.body).toEqual(    {
        product: {
          productId: 1,
          storeId: 1,
          categoryId: 1,
          productName: 'testProductOne',
          brand: 'testBrand',
          productDescription: 'testProductOneDescpription',
          image: 'testImageOne',
          price: '10',
          qty: 10,
          categoryName: 'testCategory'
        }
      });
  });

  test('fails with non exisitant product', async function () {
    const res = await request(app)
    .get(`/stores/1/products/99`)
    expect(res.statusCode).toEqual(404);
  })
});

// ******************************* GET /stores/:ownerId/products/all/:storeId ********************


describe("GET /stores/:ownerId/products/all/:storeId", function () {
  test("works for all users, no filters", async function () {
    const res = await request(app)
    .get(`/stores/1/products/all/1`)
    expect(res.body.products.length).toEqual(3);
  })

  test("works for all users, with filters", async function () {
    const res = await request(app)
    .get(`/stores/1/products/all/1?productSearch=testProductOne`)
    expect(res.body).toEqual( {
      products: [
        {
          productId: 1,
          storeId: 1,
          categoryId: 1,
          productName: 'testProductOne',
          brand: 'testBrand',
          productDescription: 'testProductOneDescpription',
          image: 'testImageOne',
          price: '10',
          qty: 10,
          categoryName: 'testCategory'
        }
      ]
    }
)
  })
})

// ********************************** PUT /stores/:ownerId/products/:productId ************************


describe("PUT /stores/:ownerId/products/:productId", function () {
  test("works for correct owner", async function () {
    const updatedProduct = {  
      productName: "UPDATEtestProductOne",
      brand: "UPDATEtestBrand",
      productDescription: "UPDATEtestProductOneDescpription",
      image: "UPDATEtestImageOne",
      price: '10',
      qty: '10',
    } 
    const res = await request(app)
      .put(`/stores/1/products/1`)
      .send(updatedProduct)
      .set("authorization", `Bearer ${ownerToken}`);
      expect(res.body).toEqual(  {
        updatedProduct: {
          product_name: 'UPDATEtestProductOne',
          product_description: 'UPDATEtestProductOneDescpription',
          product_img: 'UPDATEtestImageOne',
          qty_in_stock: 10,
          price: 10,
          store_id: 1,
          category_id: 1,
          brand: 'UPDATEtestBrand'
        }
      }) 

  });

  test("unauth if not correct owner", async function () {
    const updatedProduct = {  
      productName: "UPDATEtestProductOne",
      brand: "UPDATEtestBrand",
      productDescription: "UPDATEtestProductOneDescpription",
      image: "UPDATEtestImageOne",
      price: '10',
      qty: '10',
    } 
    const res = await request(app)
      .put(`/stores/1/products/1`)
      .send(updatedProduct)
      .set("authorization", `Bearer ${ownerTwoToken}`);
    expect(res.statusCode).toEqual(401);
  });
});

// *********************************** DELETE /stores/:ownerId/products/:storeId ******************


describe("DELETE /stores/:ownerId/products/:productId", function () {
  test("works for correct owner", async function () {
    const res = await request(app)
      .delete(`/stores/1/products/3`)
      .set("authorization", `Bearer ${ownerToken}`);
    expect(res.body).toEqual({ deleted: "1" });
  });

  test("unauth if wrong owner", async function () {
    const res = await request(app)
      .delete(`/stores/1/products/3`)
      .set("authorization", `Bearer ${ownerTwoToken}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const res = await request(app).delete(`/stores/1/products/2`);
    expect(res.statusCode).toEqual(401);
  });
});

// ************************************ POST /stores/:ownerId/carousel/:storeId **************************

describe("POST /stores/:ownerId/carousel/:storeId", function () {
  test("works with correct owner", async function () {
     const res = await request(app) 
     .post(`/stores/1/carousel/1`)
     .send({
      imageOne: "imageOneTest",
      imageOneHeader: "imageOneHeaderTest",
      imageOneText: "imageOneTextTest",
      imageTwo: "imageTwoTest",
      imageTwoHeader: "imageTwoHeaderTest",
      imageTwoText: "imageTwoTextTest",

    })
     .set("authorization", `Bearer ${ownerToken}`)
     expect(res.body).toEqual( { carousel: [ { id: 1 } ] })
  })

  test("fails with incorrect owner", async function () {
     const res = await request(app) 
     .post(`/stores/1/carousel/1`)
     .send({
      imageOne: "imageOneTest",
      imageOneHeader: "imageOneHeaderTest",
      imageOneText: "imageOneTextTest",
      imageTwo: "imageTwoTest",
      imageTwoHeader: "imageTwoHeaderTest",
      imageTwoText: "imageTwoTextTest",

    })
     .set("authorization", `Bearer ${ownerTwoToken}`)
     expect(res.statusCode).toEqual(401)
  })
})

// ********************************* GET /stores/:ownerId/carousel/:storeId **********************

describe("GET /stores/:ownerId/carousel/:storeId", function () {
  test("works", async function () {
    const res = await request(app)
      .get(`/stores/1/carousel/1`)
    expect(res.body).toEqual(    {
      carousel: {
        imageOne: 'imageOneTest',
        imageOneHeader: 'imageOneHeaderTest',
        imageOneText: 'imageOneTextTest',
        imageTwo: 'imageTwoTest',
        imageTwoHeader: 'imageTwoHeaderTest',
        imageTwoText: 'imageTwoTextTest'
      }
    });
  });

});

// *************************************** PUT /stores/:ownerId/carousel/:storeId *********************


describe("PUT /stores/:ownerId/carousel/:storeId", function () {
  test("works for correct owner", async function () {
    const res = await request(app)
      .put(`/stores/1/carousel/1`)
      .send({
        imageOne: "UPDATEimageOneTest",
        imageOneHeader: "UPDATEimageOneHeaderTest",
        imageOneText: "UPDATEimageOneTextTest",
        imageTwo: "UPDATEimageTwoTest",
        imageTwoHeader: "imageTwoHeaderTest",
        imageTwoText: "imageTwoTextTest",
  
      })
      .set("authorization", `Bearer ${ownerToken}`);
      expect(res.body).toEqual(    {
        updatedCarousel: {
          store_id: '1',
          image_one: 'UPDATEimageOneTest',
          image_one_header: 'UPDATEimageOneHeaderTest',
          image_one_text: 'UPDATEimageOneTextTest',
          image_two: 'UPDATEimageTwoTest',
          image_two_header: 'imageTwoHeaderTest',
          image_two_text: 'imageTwoTextTest'
        }
      })

  });

  test("unauth if not correct owner", async function () {
    const res = await request(app)
      .put(`/stores/1/carousel/1`)
      .send({
        imageOne: "UPDATEimageOneTest",
        imageOneHeader: "UPDATEimageOneHeaderTest",
        imageOneText: "UPDATEimageOneTextTest",
        imageTwo: "UPDATEimageTwoTest",
        imageTwoHeader: "imageTwoHeaderTest",
        imageTwoText: "imageTwoTextTest",
  
      })
      .set("authorization", `Bearer ${ownerTwoToken}`);
    expect(res.statusCode).toEqual(401);
  });
});

