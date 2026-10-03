'use strict';

// Physical table assignment is intentionally independent from Swiss pairing.
// Input pairs are never changed; only table numbers are optimized.

function normalizeName(value){ return String(value || '').trim(); }

function buildTableHistory(rounds){
  const history = new Map();
  for(const round of rounds || []){
    const roundNo = Number(round.roundNumber ?? round.round_number ?? 0);
    for(const row of round.tables || []){
      const table = Number(row.tableNumber ?? row.table_number);
      if(!Number.isFinite(table)) continue;
      for(const rawName of [row.player1, row.player2]){
        const name = normalizeName(rawName); if(!name) continue;
        if(!history.has(name)) history.set(name, []);
        history.get(name).push({roundNo, table});
      }
    }
  }
  for(const rows of history.values()) rows.sort((a,b)=>a.roundNo-b.roundNo);
  return history;
}

function tableCost(pair, table, history){
  let cost = 0;
  for(const rawName of [pair.player1, pair.player2]){
    const name = normalizeName(rawName);
    const rows = history.get(name) || [];
    const sameCount = rows.filter(x=>x.table===table).length;
    const last = rows.length ? rows[rows.length-1] : null;

    // Strongly avoid a third visit to the same physical table.
    if(sameCount >= 3) cost += 1000000 + (sameCount-3)*1000000;
    else if(sameCount === 2) cost += 100000;
    else if(sameCount === 1) cost += 1000;

    // Prefer not to use the same table in consecutive rounds.
    if(last && last.table===table) cost += 10000;
  }
  return cost;
}

function assignTables(pairs, rounds, tableNumbers){
  const cleanPairs=(pairs || []).map((p,i)=>({...p,_index:i}));
  const tables=(tableNumbers && tableNumbers.length ? tableNumbers : cleanPairs.map((_,i)=>i+1)).map(Number);
  if(cleanPairs.length !== tables.length) throw new Error('Pāru un galdiņu skaitam jābūt vienādam.');
  if(cleanPairs.length > 20) throw new Error('Testa optimizators paredzēts ne vairāk kā 20 pāriem.');

  const history=buildTableHistory(rounds);
  const n=cleanPairs.length;
  const costs=cleanPairs.map(p=>tables.map(t=>tableCost(p,t,history)));

  // Exact minimum-cost assignment using DP over table masks.
  const memo=new Map();
  function solve(i,mask){
    if(i===n) return {cost:0, choices:[]};
    const key=i+'|'+mask; if(memo.has(key)) return memo.get(key);
    let best=null;
    for(let j=0;j<n;j++){
      if(mask & (1<<j)) continue;
      const tail=solve(i+1,mask|(1<<j));
      const total=costs[i][j]+tail.cost;
      if(!best || total<best.cost || (total===best.cost && tables[j]<tables[best.choices[0]]))
        best={cost:total,choices:[j,...tail.choices]};
    }
    memo.set(key,best); return best;
  }
  const best=solve(0,0);
  return cleanPairs.map((p,i)=>({
    tableNumber:tables[best.choices[i]],
    player1:p.player1,
    player2:p.player2,
    assignmentCost:costs[i][best.choices[i]]
  })).sort((a,b)=>a.tableNumber-b.tableNumber);
}

module.exports={assignTables,buildTableHistory,tableCost};
