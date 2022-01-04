

// 取り組み方について
// 【準備】
// ・lotteryTicket関数内のコメントアウトを解除してsetTimeoutを動かす。
// ・今回は基本的ライブラリは使わない。どうしても使いたければ相談。
// ・下記条件を確認の上不明点を黒川に確認する
// 【必須条件】
// ・非同期処理を用いてsetTimeoutで遅延されても問題ないよう実装する。
// ・買えた時と買えなかった時で処理をしっかりと分岐させる。(サンプルコードは書き換えてOK)
// ・チケットの日付を「2020/01/01 ~ 2020/03/31」の間でランダムにする(専用の関数を作成すること)
// 【おまけ】
// ・その他、機能追加しても良い
// （Ex:
// 　・会員だと確率が上がる、割引がかかる。
// 　・チケットの総枚数を決めておく。
// 　・複数枚応募できるようにする。
//  etc...）
// - チケット販売クラス -
class TicketManager {

    // -- チケットデータ --
    private ticket = {
        name: 'musicLive',
        price: 5000,
        day: this.randomDate("2020,01,01","2020,03,31"),
    };


    // 会員であったら繁忙期を除いて割引がかかる
    private discount(ticketDate:string,memberNum:number):void {
        if(memberNum) {
            if (!(ticketDate === "2020/01/01" || ticketDate ==="2020/01/02" || ticketDate ==="2020/01/03")) {
                this.ticket.price *= 0.8;
            }
        }
    }

    // チケットの日付を「2020/01/01 ~ 2020/03/31」の間でランダム
    private randomDate(fromTMD:string,toTMD:string):string {
        let fromMm:Date = new Date(fromTMD);
        let toMm:Date = new Date(toTMD);

        let randomMm:number = fromMm.getTime() + Math.floor( Math.random() * (toMm.getTime() - fromMm.getTime()));

        let setMm:Date = new Date(randomMm);
        //フォーマット整形
        let y:number = setMm.getFullYear();
        let m:string = ("00" + (setMm.getMonth()+1)).slice(-2);
        let d:string = ("00" + setMm.getDate()).slice(-2);

        return y + "/" + m + "/" + d;
    }

    // -- 乱数と挑戦回数の保持 --
    private randomNum: number = 1000;
    private tryCount: number = 0;
    // -- チケットの抽選 --
    private lotteryTicket = (min: number, max: number): Promise<boolean> => new Promise((resolve,reject) => {
        setTimeout(() => {
            this.randomNum = Math.floor(Math.random() * (max + 1 - min)) + min;
            if (!!(this.randomNum % 2)) {
                resolve(true);
            } else {
                reject();
            }
        }, this.randomNum);
    }) ;
    // -- 再挑戦 --
    private reTryTicket(info:{member:number,buyerName:string}) {
        console.log(info.buyerName + "さん");
        console.log('チケットが買えなかった！');
        if (this.tryCount <= 2) {
            console.log('再抽選に挑戦します');
            this.tryCount++;
            this.ticket.price += this.randomNum * 100;
            this.ticketChallenge(info);
        }else {
            console.log('次のチャンスで頑張ろう！！');
        }
    }
    // -- チケット購入チャレンジ --
    readonly ticketChallenge = (info:{member:number,buyerName:string}) => {
        this.lotteryTicket(5, 15)
            .then(() => {
                console.log(info.buyerName + "さん");
                console.log( this.ticket.day + 'のチケットが買えた！');

                this.discount(this.ticket.day,info.member); // 会員であるか確認
                console.log(`チケット代は${this.ticket.price}円です`);

                this.ticket.price = 5000;
            })
            .catch(() => {
                this.reTryTicket(info);
            })
    }
}


// チケット購入者情報
let buyerInfo = [
    {
        member: 1234000,
        buyerName: "aaa"
    },
    {
        member: 1239099,
        buyerName:"vvv"
    },
    {
        member:22222,
        buyerName: "mmm"
    },
    {
        member: 0,
        buyerName: "uuu"
    }
]

buyerInfo.forEach((value:{member:number,buyerName:string}) => {
    const ticketManager = new TicketManager();
    ticketManager.ticketChallenge(value);
});


