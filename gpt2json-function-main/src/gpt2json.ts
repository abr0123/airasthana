import processEntry from "./processEntry";
export default async function gpt2json(data: any[], promptType: string, fileName: string) {
  let bool= false;
  try{
    for (const element of data) {
      bool=true;
      await processEntry(element, promptType, fileName);
    }
    return bool;
  }catch(e){
    return e;
  }
}

//to test
//gpt2json(data, 'classification', 'asdf');
