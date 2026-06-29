<?php
// app/http/Controller/ProductController.php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ProductController extends Controller
{
    private string $apiUrl = 'https://6a1f10beb79eec0d6cf07a62.mockapi.io/api/watch/watch';
    
    public function getProduct(){
        $response = Http::withoutVerifying()->get($this->apiUrl);

        if(!$response -> successful()){
            return response() -> json([
                "success" => false,
                "message" => "Cannot fetch products."
            ], 500);
        }

        return response()->json([
            "success" => true,
            "data" => $response->json()
        ]);
    }

    
    public function insertProduct(Request $request){
        $response = Http::withoutVerifying()->post($this->apiUrl, [
            "name" => $request->name,
            "price" => $request->price,
            "qty" => $request->qty,
            "description" => $request->description,
            "image" => $request->image 
        ]);

        if(!$response -> successful()){
            return response()->json([
                "success" => false,
                "message" => "Insert failed."
            ], 500);
        }

        return response()->json([
            "success" => true,
            "message" => "Product added successfully.",
            "data"=> $response->json()
        ]);
    }


    public function deleteProduct($id){
        $response = Http::withoutVerifying()->delete("{$this->apiUrl}/{$id}");

        if(!$response -> successful()){
            return response()->json([
                "success" => false,
                "message" => "Delete Failed"
            ], 500);
        }

        return response()->json([
            "success" => true,
            "message" => "Product deleted."
        ]);
    }
   
    public function updateProduct(Request $request, $id){
        $response = Http::withoutVerifying()->put(
            "{$this -> apiUrl}/{$id}",
            $request -> all()
        );

        if(!$response -> successful()){
            return response()-> json([
                "success"=> false,
                "message" => "Update failed."
            ], 500);
        }

        return response()->json([
            "success" => true,
            "message" => "Product Updated.",
            "data" => $response->json()
        ]);
    }
}

    //
    // public function getProduct(){

    //     // 1. Fetch data from the external MockAPI
    //     $response = Http::get('https://6a1f10beb79eec0d6cf07a62.mockapi.io/api/watch/watch');

    //     // 2. Check if the request was successful
    //     if ($response->successful()) {
    //         $products = $response->json(); // Convert response to an array/json
            
    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Get Product Successfully',
    //             'data' => $products
    //         ], 200);
    //     }

    //     // Return an error if MockAPI fails
    //     return response()->json([
    //         'success' => false,
    //         'message' => 'Failed to fetch data from MockAPI'
    //     ], 500);

    //     // $product = Product::all();
    //     // return response() -> json(
    //     //     [
    //     //         "message" => "Get Product Successfully",
    //     //         "data" => $product
    //     //     ],
    //     //     200
    //     // );

    // }

// public function insertProduct(Request $request){
    //     //validate
    //     $validate = $request -> validate(
    //         [
    //             'name' => 'required',
    //             'qty' => 'required|numeric',
    //             'price' => 'required|numeric',
    //             'description' => 'required',
    //             'image' => 'required'
    //         ]
    //     );
    //     // Note: Ensure these fields are in the $fillable array of your Product model
    //     $product = Product::create($request->all());
    //     return response()->json(
    //         [
    //             'message' => "Insert Product Successfully",
    //             'data' => $product 
    //         ],201
    //     );
    // }


    // public function deleteProduct($id){
    //     $product = Product::find($id);

    //     // Prevent crashing if the product doesn't exist
    //     if (!$product) {
    //         return response()->json([
    //             'message' => "Product not found"
    //         ], 404);
    //     }

    //     // $delte = $product -> delete();
    //     $product -> delete(); // Fixed typo here ($delte -> $product)

    //     return response() -> json(
    //         [
    //             'message' => "Delete Product SuccessFully",
    //             'data' => $product
    //         ], 200
    //     );
    // }

    // public function update(Request $request, $id)
    // {
    //     $validate = $request->validate([
    //         "name" => 'required',
    //         'qty' => 'required|numeric',
    //         'price' => 'required|numeric',
    //         'description' => 'required',
    //         'image' => 'required'
    //         ]);

    //         $update = Product::find($id);

    //         // Prevent crashing if the product doesn't exist
    //         if (!$update) {
    //             return response()->json([
    //                 'message' => "Product not found"
    //             ], 404);
    //         }

    //         $update -> update($request->all());

    //         return response()->json([
    //             "message" => "Updated Successfully",
    //             'data' => $update
    //         ], 200);
    // }
