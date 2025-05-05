import { useState, useRef, useEffect } from "react";
import AudioControl from "./AudioControl";

type AudioPlayerProps = {
  surahId: string; // ID surah yang akan diputar
  ayahNumber?: number; // Nomor ayat yang akan diputar (opsional)
};

function AudioPlayer({ surahId, ayahNumber = 1 }: AudioPlayerProps) {
  const [currentReciter, setCurrentReciter] = useState("01");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioSrc, setAudioSrc] = useState("");

  // Fungsi untuk mengubah qari/reciter
  const changeReciter = (reciterId: string) => {
    setCurrentReciter(reciterId);
    // Stop audio jika sedang bermain saat ganti reciter
    if (audioPlaying) {
      handlePause();
    }
  };

  // Memperbarui URL audio saat reciter atau surah berubah
  useEffect(() => {
    // Format surahId dengan padding 3 digit (001, 002, dll)
    const formattedSurahId = surahId.padStart(3, "0");
    // Format ayah dengan padding 3 digit
    const formattedAyah = String(ayahNumber).padStart(3, "0");
    
    // Contoh URL untuk audio Al-Quran (sesuaikan dengan API/sumber yang Anda gunakan)
    // Format URL ini contoh saja, sesuaikan dengan API yang sebenarnya digunakan
    const url = `https://audio.qurancentral.com/reciters/${currentReciter}/${formattedSurahId}/${formattedAyah}.mp3`;
    setAudioSrc(url);
    
    // Membuat element audio baru
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
    } else {
      audioRef.current = new Audio(url);
    }
    
    // Event listener saat audio selesai
    audioRef.current.onended = () => {
      setAudioPlaying(false);
    };
  }, [currentReciter, surahId, ayahNumber]);

  // Fungsi untuk play audio
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setAudioPlaying(true);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
        });
    }
  };

  // Fungsi untuk pause audio
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioPlaying(false);
    }
  };

  return (
    <div className="audio-player p-4 rounded-lg bg-gray-800">
      {/* Audio element yang tersembunyi */}
      <audio ref={audioRef} src={audioSrc} className="hidden" />
      
      <AudioControl
        currentReciter={currentReciter}
        audioPlaying={audioPlaying}
        changeReciter={changeReciter}
        onPlay={handlePlay}
        onPause={handlePause}
      />
    </div>
  );
}

export default AudioPlayer;