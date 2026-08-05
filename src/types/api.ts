export type ActionResult<T=undefined>={ok:true;data:T}|{ok:false;code:string;message:string;fieldErrors?:Record<string,string[]>};
export type SerializableRecord=Record<string,unknown>&{id:string};
