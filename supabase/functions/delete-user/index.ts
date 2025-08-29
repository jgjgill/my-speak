import { createClient } from "npm:@supabase/supabase-js@2";

console.log("Delete User Function initialized!");

// CORS 헤더 설정
const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
	// CORS preflight 요청 처리
	if (req.method === "OPTIONS") {
		return new Response("ok", { headers: corsHeaders });
	}

	try {
		// Authorization 헤더에서 토큰 추출
		const authHeader = req.headers.get("Authorization");
		if (!authHeader) {
			return new Response(
				JSON.stringify({ error: "No authorization header" }),
				{
					status: 401,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				},
			);
		}

		const token = authHeader.replace("Bearer ", "");

		// 일반 클라이언트로 현재 사용자 확인
		const supabaseClient = createClient(
			Deno.env.get("SUPABASE_URL")!,
			Deno.env.get("SUPABASE_ANON_KEY")!,
		);

		const {
			data: { user },
			error: authError,
		} = await supabaseClient.auth.getUser(token);

		if (authError || !user) {
			return new Response(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		console.log(`🗑️ User deletion requested: ${user.email} (${user.id})`);

		// Admin 클라이언트로 사용자 삭제
		const supabaseAdmin = createClient(
			Deno.env.get("SUPABASE_URL")!,
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
		);

		// 🔥 사용자 계정 삭제 (CASCADE로 관련 데이터 자동 삭제)
		const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
			user.id,
		);

		if (deleteError) {
			console.error(`❌ Failed to delete user: ${deleteError.message}`);
			return new Response(JSON.stringify({ error: deleteError.message }), {
				status: 400,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		console.log(`✅ User successfully deleted: ${user.email}`);

		return new Response(
			JSON.stringify({
				success: true,
				message: "Account deleted successfully",
				deleted_user_id: user.id,
			}),
			{
				status: 200,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("🔥 Edge Function Error:", error);

		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	}
});

/* To invoke:

  1. Deploy: `supabase functions deploy delete-user`
  2. Set secrets: `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key`
  3. Make an HTTP request:

  curl -i --location --request POST 'https://your-project.supabase.co/functions/v1/delete-user' \
    --header 'Authorization: Bearer your_user_access_token'

*/
