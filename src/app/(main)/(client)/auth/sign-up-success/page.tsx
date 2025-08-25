import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {

  return (
    // <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    //   <div className="w-full max-w-sm">
    //     <div className="flex flex-col gap-6">
    //       <Card>
    //         <CardHeader>
    //           <CardTitle className="text-2xl">
    //             Thank you for signing up!
    //           </CardTitle>
    //           <CardDescription>Check your email to confirm</CardDescription>
    //         </CardHeader>
    //         <CardContent>
    //           <p className="text-sm text-muted-foreground">
    //             You&apos;ve successfully signed up. Please check your email to
    //             confirm your account before signing in.
    //           </p>
    //         </CardContent>
    //       </Card>
    //     </div>
    //   </div>
    // </div>

    <div className="w-full flex items-center justify-center min-h-[100vh] p-20 flex-col text-center">
      <div className="max-w-md w-full space-y-6 pb-20 text-left">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-[#50462D] text-[30px] leading-[40px] lg:text-[36px] lg:leading-[48px] font-[400] font-[Century-Old-Style]">
            Thank you for signing up!
          </h2>
          <p className="text-[#50462D] text-[14px] leading-[26px] lg:text-[18px] lg:leading-[28px] font-[Century-Old-Style]">
            You&apos;ve successfully signed up. Please check your email to
            confirm your account before signing in.
          </p>
        </div>

        {/* Continue Shopping Button */}
        {/* <div className=""> */}
          {/* <button
            onClick={() => router.push("/products")}
            className="bg-[#FBD060] text-[#1E1204] font-schoolbook-cond font-[400] text-[0.70rem] leading-[119.58%] w-[15.812rem] h-[2rem] uppercase rounded-[6px] hover:opacity-90 transition-opacity lg:text-[0.75rem] lg:w-[20.812rem] lg:h-[2.5rem]"
          >

            CONTINUE SHOPPING &gt;
          </button> */}
        {/* </div> */}
      </div>
    </div>
  );
}
