"use client";
import { getProviders, signIn } from "next-auth/react";

type Props = {
  /*
  What's Awaited: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#the-awaited-type-and-promise-improvements
  type A = Awaited<Promise<string>>; // A = string

  Whta's ReturnType: https://ithelp.ithome.com.tw/m/articles/10272213, https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype
  type T0 = ReturnType<() => string>; // T0 = string

  getProviders 的 type 是: 
  (alias) function getProviders(): Promise<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>
  我們在裡拿到的 props.providers 是上一層執行 await getProviders() 完 return 的值 
  我們先通過 typeof getProviders 拿到 getProviders 的 type

  再通過 ReturnType<Type> 拿到 typeof getProviders 的 return type: ReturnType<typeof getProviders>
  這時候我們拿到的 type 是一個 Promise
  像是: Promise<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>

  然後再通過 Awaited Type 拿到 Promise 中的類型: Awaited<ReturnType<typeof getProviders>>
  這時候我們就可以拿到 Promise Type 中的 type:  Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null
*/
  providers: Awaited<ReturnType<typeof getProviders>>;
};

function SignInComponent({ providers }: Props) {
  // console.log("providers: ", providers);
  return (
    <div className="flex justify-center">
      {Object.values(providers!).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: process.env.VERCEL_URL || "http://localhost:3000",
              })
            }
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default SignInComponent;
