export type Screen = 'HOME' | 'HURUF' | 'ANGKA' | 'WARNA' | 'HEWAN' | 'KUIS' | 'KOTLIN_CODE';

export interface HurufItem {
  huruf: string;
  kata: string;
  artinya: string;
  emoji: string;
  warna: string;
  bgGradasi: string;
  kalimat: string;
}

export interface AngkaItem {
  angka: number;
  terbilang: string;
  objekNama: string;
  emoji: string;
  warna: string;
  bgGradasi: string;
  listObjek: string[];
}

export interface WarnaItem {
  id: string;
  nama: string;
  hex: string;
  bgTailwind: string;
  textTailwind: string;
  contohBenda: { nama: string; emoji: string }[];
  deskripsi: string;
}

export interface HewanItem {
  id: string;
  nama: string;
  emoji: string;
  suaraTeks: string;
  suaraKarakter: string;
  suaraAudioType: 'kucing' | 'anjing' | 'ayam' | 'sapi' | 'kambing' | 'ikan' | 'burung' | 'gajah' | 'bebek' | 'singa';
  habitat: string;
  warna: string;
  makanan: string;
}

export interface QuizOption {
  id: string;
  label: string;
  subLabel?: string;
  visual: string; // emoji or color or letter
  isColor?: boolean;
  colorHex?: string;
}

export interface QuizQuestion {
  id: number;
  kategori: 'HURUF' | 'ANGKA' | 'WARNA' | 'HEWAN';
  pertanyaan: string;
  suaraTeks: string;
  pilihan: QuizOption[];
  jawabanBenarId: string;
  pujian: string;
}
