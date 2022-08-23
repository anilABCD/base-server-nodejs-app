class RegexExtract {
  //
  Match(str: string | undefined, regex: RegExp) {
    // error regex : /(\/.+\/)(.+)(:.+:.+)/gm

    //////////////////////////////////////////////////////////////////////////////////
    // regex = /\[([^\]\[\r\n]*)\]/gm;
    //     str = `This is a [sample] string with [some] special words. [another one]
    // This is a [sample string with [some special words. [another one
    // This is a [sample[sample]] string with [[some][some]] special words. [[another one]]`;
    //////////////////////////////////////////////////////////////////////////////////

    let m = str?.match(regex);

    const resultMatchArray: string[] = [];
    m?.forEach((match) => {
      resultMatchArray.push(match);
    });

    return resultMatchArray;
  }

  AllInfo(str: string | undefined, regex: RegExp) {
    // error regex : /(\/.+\/)(.+)(:.+:.+)/gm

    //////////////////////////////////////////////////////////////////////////////////
    // regex = /\[([^\]\[\r\n]*)\]/gm;
    //     str = `This is a [sample] string with [some] special words. [another one]
    // This is a [sample string with [some special words. [another one
    // This is a [sample[sample]] string with [[some][some]] special words. [[another one]]`;
    //////////////////////////////////////////////////////////////////////////////////
    const resultMatchArray: string[] = [];

    if (str) {
      let m: RegExpExecArray | null;

      //   console.log("match", m);

      while ((m = regex.exec(str)) !== null) {
        //
        m.forEach((match) => {
          resultMatchArray.push(match);
        });
        //
      }
    }

    return resultMatchArray;
  }

  ErrorInfo(str: string | undefined) {
    //
    let regex: RegExp = /(\/.+\/)(.+)(:.+:.+)/gm;

    let resultMatchArray = this.AllInfo(str, regex);

    // console.log("Result Match Array", resultMatchArray);

    let fileName = resultMatchArray[10];
    let lineNumber = resultMatchArray[11];

    type error = {
      fileName: string;
      lineNumber: string;
    };

    let errorInfo: error = {
      fileName,
      lineNumber: lineNumber.substring(1),
    };

    return errorInfo;
  }
}

export default new RegexExtract();
