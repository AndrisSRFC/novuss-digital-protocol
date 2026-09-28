import argparse, json, threading, time, urllib.request
import tkinter as tk
from tkinter import ttk, messagebox

def fetch_results(base):
    with urllib.request.urlopen(base.rstrip('/') + '/api/swiss-master/results', timeout=15) as r:
        return json.load(r)

def send_key(cmd):
    # Windows-only, no external packages: send a normal keyboard key to the foreground window.
    import ctypes
    user32 = ctypes.windll.user32
    VK = {1:0x31, 2:0x32, 3:0x33}[int(cmd)]
    user32.keybd_event(VK, 0, 0, 0)
    user32.keybd_event(VK, 0, 2, 0)

class App:
    def __init__(self, root, base):
        self.root=root; self.base=base; self.rows=[]
        root.title('Novuss -> Swiss Master Bridge TEST')
        root.geometry('760x460')
        ttk.Label(root,text='Swiss Master Bridge — TEST',font=('Segoe UI',16,'bold')).pack(anchor='w',padx=14,pady=(14,2))
        ttk.Label(root,text='Izvēlies rezultātu. Tad 3 sekunžu laikā Swiss Master Edit Results logā izvēlies pareizo pāri.').pack(anchor='w',padx=14)
        cols=('table','p1','p2','novuss','swiss')
        self.tree=ttk.Treeview(root,columns=cols,show='headings',height=14)
        for c,t,w in [('table','Galds',65),('p1','Pirmais',180),('p2','Otrais',180),('novuss','Novuss',80),('swiss','Swiss',100)]:
            self.tree.heading(c,text=t); self.tree.column(c,width=w,anchor='center' if c in ('table','novuss','swiss') else 'w')
        self.tree.pack(fill='both',expand=True,padx=14,pady=12)
        bar=ttk.Frame(root); bar.pack(fill='x',padx=14,pady=(0,14))
        ttk.Button(bar,text='Atjaunot',command=self.refresh).pack(side='left')
        ttk.Button(bar,text='Send selected result',command=self.start_send).pack(side='right')
        self.status=ttk.Label(bar,text=''); self.status.pack(side='left',padx=12)
        self.refresh()
    def refresh(self):
        try:
            d=fetch_results(self.base); self.rows=d.get('results',[])
            for x in self.tree.get_children(): self.tree.delete(x)
            for i,p in enumerate(self.rows):
                label={1:'1 -> 1-0',2:'2 -> 0-1',3:'3 -> 1/2-1/2'}.get(p['command'],str(p['command']))
                self.tree.insert('', 'end', iid=str(i), values=(p['tableNumber'],p['player1'],p['player2'],f"{p['score1']}:{p['score2']}",label))
            self.status.config(text=f"Kārta {d.get('roundNumber','-')} · {len(self.rows)} pabeigti")
        except Exception as e: messagebox.showerror('Bridge',str(e))
    def start_send(self):
        sel=self.tree.selection()
        if len(sel)!=1: return messagebox.showwarning('Bridge','Izvēlies vienu rezultāta rindu.')
        p=self.rows[int(sel[0])]
        text=f"Galds {p['tableNumber']}: {p['player1']} — {p['player2']}\nNovuss {p['score1']}:{p['score2']}\nSwiss komanda {p['command']}\n\nTurpināt?"
        if not messagebox.askyesno('Pārbaudi pāri',text): return
        self.status.config(text='3... aktivizē Swiss Master un izvēlies pāri')
        threading.Thread(target=self.countdown,args=(p,),daemon=True).start()
    def countdown(self,p):
        for n in (3,2,1):
            self.root.after(0,lambda n=n:self.status.config(text=f'{n}... aktivizē Swiss Master un izvēlies pāri'))
            time.sleep(1)
        send_key(p['command'])
        self.root.after(0,lambda:self.status.config(text=f"Nosūtīta komanda {p['command']} galdam {p['tableNumber']}"))

if __name__=='__main__':
    ap=argparse.ArgumentParser(); ap.add_argument('--url',default='https://novuss-digital-protocol.onrender.com'); args=ap.parse_args()
    root=tk.Tk(); App(root,args.url); root.mainloop()
