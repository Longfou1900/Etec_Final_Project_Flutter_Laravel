<?php
// app/http/Controller/AuthController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    private string $apiUrl = 'https://6a1f10beb79eec0d6cf07a62.mockapi.io/api/watch/watchUser';

    // LOGIN — compare against MockAPI users (plain-text password)
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $response = Http::withoutVerifying()->get($this->apiUrl);

        if (!$response->successful()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot connect to user API.',
            ], 500);
        }

        $matched = null;
        foreach ($response->json() as $item) {
            if (
                isset($item['email'], $item['password']) &&
                $item['email']    === $request->email &&
                $item['password'] === $request->password
            ) {
                $matched = $item;
                break;
            }
        }

        if (!$matched) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password.',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successfully',
            'user'    => [
                'id'       => $matched['id']       ?? null,
                'username' => $matched['username'] ?? null,
                'name'     => $matched['username'] ?? null,
                'email'    => $matched['email']    ?? null,
                'role'     => $matched['role']     ?? 'user',
                'location' => $matched['location'] ?? null,
                'phone'    => $matched['phone']    ?? null,
                'sex'      => $matched['sex']      ?? null,
                'image'    => $matched['image']    ?? null,
                'bio'      => $matched['bio']      ?? null,
                'banned'   => $matched['banned']   ?? false,
                'createdAt'=> $matched['createdAt'] ?? null,
            ],
        ], 200);
    }

    // REGISTER — POST new user to MockAPI
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255',
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        // Check duplicate email
        $all = Http::withoutVerifying()->get($this->apiUrl);
        if ($all->successful()) {
            foreach ($all->json() as $item) {
                if (isset($item['email']) && $item['email'] === $request->email) {
                    return response()->json([
                        'success' => false,
                        'message' => 'This email is already registered.',
                    ], 422);
                }
            }
        }

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $response = Http::withoutVerifying()->post($this->apiUrl, [
            'username'       => $request->username,
            'email'          => $request->email,
            'password'       => $request->password,
            'role'           => 'user',
            'code'           => $code,
            'forgotPassword' => '',
            'location'       => $request->location ?? '',
            'phone'          => $request->phone    ?? '',
            'sex'            => $request->sex      ?? '',
            'image'          => '',
            'bio'            => '',
            'createdAt'      => now()->timestamp,
        ]);

        if (!$response->successful()) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create account.',
            ], 500);
        }

        $new = $response->json();
        return response()->json([
            'success' => true,
            'message' => 'Account created successfully.',
            'user'    => [
                'id'       => $new['id']       ?? null,
                'username' => $new['username'] ?? null,
                'name'     => $new['username'] ?? null,
                'email'    => $new['email']    ?? null,
                'role'     => $new['role']     ?? 'user',
                'code'     => $code,
            ],
        ], 201);
    }

    // LOGOUT — stateless, just tell JS to clear localStorage
    public function logout(Request $request)
    {
        return response()->json(['success' => true, 'message' => 'Logged out successfully'], 200);
    }

    // GET ALL USERS — for admin Roles page
    public function getUsers()
    {
        // $response = Http::withoutVerifying()->get($this->apiUrl);
        $response = Http::withoutVerifying()->get($this->apiUrl);
        if (!$response->successful()) {
            // return response()->json(['success' => false, 'message' => 'Cannot fetch users.'], 500);
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }
        return response()->json(['success' => true, 'data' => $response->json()], 200);
    }

    // GET SINGLE USER — separate method for validateSession
    public function getUser($id)
    {
        $response = Http::withoutVerifying()->get("{$this->apiUrl}/{$id}");
        if (!$response->successful()) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }
        return response()->json(['success' => true, 'data' => $response->json()], 200);
    }

    public function createUser(Request $request)
    {
        $response = Http::withoutVerifying()->post($this->apiUrl, [
            'username' => $request->username,
            'email'    => $request->email,
            'password' => $request->password,
            'role'     => $request->role     ?? 'user',
            'location' => $request->location ?? '',
            'phone'    => $request->phone    ?? '',
            'sex'      => $request->sex      ?? '',
            'image'    => '',
            'bio'      => '',
            'banned'   => false,
            'code'     => str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT),
            'createdAt'=> now()->timestamp,
        ]);

        if (!$response->successful()) {
            return response()->json(['success' => false, 'message' => 'Failed to create user.'], 500);
        }

        return response()->json(['success' => true, 'message' => 'User created.', 'data' => $response->json()], 201);
    }

    // UPDATE USER — role change, ban, etc.
    public function updateUser(Request $request, $id)
    {
        $response = Http::withoutVerifying()->put("{$this->apiUrl}/{$id}", $request->all());
        if (!$response->successful()) {
            return response()->json(['success' => false, 'message' => 'Failed to update user.'], 500);
        }
        return response()->json(['success' => true, 'message' => 'User updated.', 'data' => $response->json()], 200);
    }

    // DELETE USER
    public function deleteUser($id)
    {
        $response = Http::withoutVerifying()->delete("{$this->apiUrl}/{$id}");
        if (!$response->successful()) {
            return response()->json(['success' => false, 'message' => 'Failed to delete user.'], 500);
        }
        return response()->json(['success' => true, 'message' => 'User deleted.'], 200);
    }
}

// app/http/Controller/AuthController.php
// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use App\Models\User;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Http;

// class AuthController extends Controller
// {
//     /**
//      * Handle user login and issue API token.
//      */
//     public function login(Request $request)
//     {
//         // 1. Validate the incoming input
//         $request->validate([
//             'email' => 'required|email',
//             'password' => 'required',
//         ]);

//         // 2. Locate the user by email
//         // $user = User::where('email', $request->email)->first();

//         // // 3. Verify user presence and evaluate password match
//         // if (!$user || !Hash::check($request->password, $user->password)) {
//         //     return response()->json([
//         //         'success' => false,
//         //         'message' => 'Invalid email or password.'
//         //     ], 401);
//         // }

//         // $response = Http::get
//         $response = Http::withoutVerifying()->get
//         ('https://6a1f10beb79eec0d6cf07a62.mockapi.io/api/watch/watchUser');
//         if(!$response->successful()){

//             return response()->json([
//                 "success"=>false,
//                 "message"=>"Cannot connect to user API."
//             ],500);

//         }

        //$response = Http::withoutVerifying()->post(
        //     "https://6a1f10beb79eec0d6cf07a62.mockapi.io/api/watch/watchUser",
        //     [
        //         // data...
        //     ]
        // );

        // $users = $response->json();
        // // dd($users);
        // $user = null;

        // foreach($users as $item){

        //     if(
        //         $item["email"] == $request->email &&
        //         $item["password"] == $request->password
        //     ){
        //         $user = $item;
        //         break;
        //     }

        // }

        // if(!$user){

        //     return response()->json([
        //         "success"=>false,
        //         "message"=>"Invalid Email or Password"
        //     ],401);

        // }

        // // 4. Issue Sanctum text token
        // // $token = $user->createToken('auth_token')->plainTextToken;
        // return response()->json([
        //     "success"=>true,
        //     "message"=>"Login Successfully",
        //     "user"=>$user
        // ]);

    //     // 5. Respond to frontend with token + user dashboard profiles
    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Logged in successfully',
    //         'token' => $token,
    //         'user' => [
    //             'id' => $user->id,
    //             'name' => $user->name,
    //             'email' => $user->email,
    //             'role' => $user->role ?? 'user' // Default fallback safety
    //         ]
    //     ], 200);
    // }

    /**
     * Terminate session and destroy current active API token.
     */
//     public function logout(Request $request)
//     {
//         // Revokes exclusively the specific token that authorized this current request
//         $request->user()->currentAccessToken()->delete();

//         return response()->json([
//             'success' => true,
//             'message' => 'Logged out successfully'
//         ], 200);
//     }
// }