# 腹膜透析日別記録

腹膜透析を受けている人が日別記録するためのアプリです。
github pagesで動作しています。
https://github.com/nomura565/peritoneal-dialysis-day-record.github.io

保存ボタン押下でLocalStrageに日々の記録を保存します。

## 値の仕様について

- 除水量＝注液量-排液量（ただし排液量が空の時は計算なし）
- n回目の排液時間＝N+1回目の排液時間To-排液時間Fromの分数
- n日の最後の回目の排液時間＝N+1日の1回目の排液時間To-排液時間Fromの分数
- 1日の総除水量＝1~5回目の除水量の合計

## github pagesの更新

下記のコマンドでgh-pages-deployブランチが更新されてgithub pagesも最新になります。
最新のソースブランチはgh-pagesです。

### `npm run deploy`
