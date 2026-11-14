import sys, numpy as np, wave, matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt
from scipy import signal
fn = sys.argv[1]; a, b = float(sys.argv[2]), float(sys.argv[3])
w=wave.open(fn); sr=w.getframerate(); x=np.frombuffer(w.readframes(w.getnframes()),"<i2").reshape(-1,2)[:,0]/32768
fig,ax=plt.subplots(3,1,figsize=(14,10))
seg=x[int(a*sr):int(b*sr)]
f,t,S=signal.spectrogram(seg,sr,nperseg=4096,noverlap=3584)
ax[0].pcolormesh(t+a,f,10*np.log10(S+1e-12),vmin=-115,vmax=-45,shading="auto",cmap="magma"); ax[0].set_yscale("log"); ax[0].set_ylim(150,6000); ax[0].set_title(f"{a}-{b} s")
env=np.abs(signal.hilbert(seg)); ax[1].plot(np.arange(len(seg))/sr+a, env, lw=0.3); ax[1].set_title("envelope")
c=np.concatenate([[0],np.cumsum(x**2)]); k=sr//2; r=np.sqrt((c[k:]-c[:-k])/k)[::sr//10]; ax[2].plot(np.arange(len(r))/10, 20*np.log10(r+1e-9)); ax[2].set_title("level dB, whole file")
plt.tight_layout(); plt.savefig("spec.png",dpi=80)
