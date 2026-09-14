export interface KotlinFile {
  name: string;
  path: string;
  description: string;
  code: string;
}

export const KOTLIN_PROJECT_FILES: KotlinFile[] = [
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/belajarpintar/anak/MainActivity.kt',
    description: 'Entry point utama Android dengan Jetpack Compose & Navigation Graph',
    code: `package com.belajarpintar.anak

import android.content.pm.ActivityInfo
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.belajarpintar.anak.ui.screens.*
import com.belajarpintar.anak.ui.theme.BelajarPintarAnakTheme
import com.belajarpintar.anak.utils.AndroidSoundManager
import com.belajarpintar.anak.data.StarDataStore

class MainActivity : ComponentActivity() {
    private lateinit var soundManager: AndroidSoundManager
    private lateinit var starDataStore: StarDataStore

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Kunci orientasi ke Portrait untuk kenyamanan anak-anak
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT

        soundManager = AndroidSoundManager(this)
        starDataStore = StarDataStore(this)

        setContent {
            BelajarPintarAnakTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    val totalStars by starDataStore.starsFlow.collectAsState(initial = 5)

                    NavHost(navController = navController, startDestination = "home") {
                        composable("home") {
                            HomeScreen(
                                stars = totalStars,
                                soundManager = soundManager,
                                onNavigateToHuruf = { navController.navigate("huruf") },
                                onNavigateToAngka = { navController.navigate("angka") },
                                onNavigateToWarna = { navController.navigate("warna") },
                                onNavigateToHewan = { navController.navigate("hewan") },
                                onNavigateToKuis = { navController.navigate("kuis") }
                            )
                        }
                        composable("huruf") {
                            AlphabetScreen(
                                stars = totalStars,
                                soundManager = soundManager,
                                onBack = { navController.popBackStack() }
                            )
                        }
                        composable("angka") {
                            NumberScreen(
                                stars = totalStars,
                                soundManager = soundManager,
                                onBack = { navController.popBackStack() }
                            )
                        }
                        composable("warna") {
                            ColorScreen(
                                stars = totalStars,
                                soundManager = soundManager,
                                onBack = { navController.popBackStack() }
                            )
                        }
                        composable("hewan") {
                            AnimalScreen(
                                stars = totalStars,
                                soundManager = soundManager,
                                onBack = { navController.popBackStack() }
                            )
                        }
                        composable("kuis") {
                            QuizScreen(
                                stars = totalStars,
                                soundManager = soundManager,
                                onAddStar = { starDataStore.incrementStar() },
                                onBack = { navController.popBackStack() }
                            )
                        }
                    }
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        soundManager.shutdown()
    }
}`,
  },
  {
    name: 'HomeScreen.kt',
    path: 'app/src/main/java/com/belajarpintar/anak/ui/screens/HomeScreen.kt',
    description: 'Halaman Beranda dengan tombol besar ceria dan kartu belajar',
    code: `package com.belajarpintar.anak.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.belajarpintar.anak.utils.AndroidSoundManager

@Composable
fun HomeScreen(
    stars: Int,
    soundManager: AndroidSoundManager,
    onNavigateToHuruf: () -> Unit,
    onNavigateToAngka: () -> Unit,
    onNavigateToWarna: () -> Unit,
    onNavigateToHewan: () -> Unit,
    onNavigateToKuis: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFFFBEB)) // Soft warm yellow
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Star Counter Badge
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.End,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = RoundedCornerShape(24.dp),
                color = Color(0xFFFEF3C7),
                shadowElevation = 2.dp,
                modifier = Modifier.padding(4.dp)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("⭐", fontSize = 20.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "$stars Bintang",
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFB45309),
                        fontSize = 16.sp
                    )
                }
            }
        }

        // Mascot & Title
        Spacer(modifier = Modifier.height(8.dp))
        Text(text = "🎈", fontSize = 48.sp)
        Text(
            text = "Belajar Pintar Anak",
            fontSize = 28.sp,
            fontWeight = FontWeight.Black,
            color = Color(0xFF1E293B)
        )
        Text(
            text = "Ayo Belajar Sambil Bermain!",
            fontSize = 15.sp,
            color = Color(0xFF64748B),
            modifier = Modifier.padding(bottom = 20.dp)
        )

        // Menu Tombol Besar
        ChildBigButton(
            title = "Belajar Huruf",
            subtitle = "A sampai Z & Contoh Kata",
            emoji = "🔤",
            colorStart = Color(0xFFFF6B6B),
            colorEnd = Color(0xFFFF8E53),
            onClick = {
                soundManager.playClick()
                soundManager.speak("Belajar Huruf A sampai Z")
                onNavigateToHuruf()
            }
        )

        Spacer(modifier = Modifier.height(14.dp))
        ChildBigButton(
            title = "Belajar Angka",
            subtitle = "Mengenal 1 sampai 10 & Berhitung",
            emoji = "🔢",
            colorStart = Color(0xFF4FACFE),
            colorEnd = Color(0xFF00F2FE),
            onClick = {
                soundManager.playClick()
                soundManager.speak("Belajar Angka satu sampai sepuluh")
                onNavigateToAngka()
            }
        )

        Spacer(modifier = Modifier.height(14.dp))
        ChildBigButton(
            title = "Belajar Warna",
            subtitle = "Merah, Biru, Kuning & Warna Lain",
            emoji = "🎨",
            colorStart = Color(0xFF43E97B),
            colorEnd = Color(0xFF38F9D7),
            onClick = {
                soundManager.playClick()
                soundManager.speak("Belajar Mengenal Warna")
                onNavigateToWarna()
            }
        )

        Spacer(modifier = Modifier.height(14.dp))
        ChildBigButton(
            title = "Mengenal Hewan",
            subtitle = "Suara & Nama Hewan Lucu",
            emoji = "🦁",
            colorStart = Color(0xFFFA709A),
            colorEnd = Color(0xFFFEE140),
            onClick = {
                soundManager.playClick()
                soundManager.speak("Mengenal Hewan Lucu")
                onNavigateToHewan()
            }
        )

        Spacer(modifier = Modifier.height(14.dp))
        ChildBigButton(
            title = "Kuis Ceria ⭐",
            subtitle = "Jawab Benar & Kumpulkan Bintang!",
            emoji = "🏆",
            colorStart = Color(0xFFF6D365),
            colorEnd = Color(0xFFFDA085),
            onClick = {
                soundManager.playClick()
                soundManager.speak("Ayo Bermain Kuis dan Kumpulkan Bintang!")
                onNavigateToKuis()
            }
        )

        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
fun ChildBigButton(
    title: String,
    subtitle: String,
    emoji: String,
    colorStart: Color,
    colorEnd: Color,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(84.dp)
            .shadow(6.dp, shape = RoundedCornerShape(22.dp))
            .clip(RoundedCornerShape(22.dp))
            .background(Brush.horizontalGradient(listOf(colorStart, colorEnd)))
            .clickable(onClick = onClick)
            .padding(horizontal = 20.dp, vertical = 12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = emoji, fontSize = 42.sp)
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = subtitle,
                    fontSize = 13.sp,
                    color = Color.White.copy(alpha = 0.9f)
                )
            }
            Text(text = "▶", fontSize = 20.sp, color = Color.White.copy(alpha = 0.8f))
        }
    }
}`,
  },
  {
    name: 'AlphabetScreen.kt',
    path: 'app/src/main/java/com/belajarpintar/anak/ui/screens/AlphabetScreen.kt',
    description: 'Materi Belajar Huruf A-Z dengan tombol suara TTS',
    code: `package com.belajarpintar.anak.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.belajarpintar.anak.utils.AndroidSoundManager

data class HurufModel(val letter: String, val word: String, val emoji: String, val color: Color)

val listHuruf = listOf(
    HurufModel("A", "Apel", "🍎", Color(0xFFEF4444)),
    HurufModel("B", "Bola", "⚽", Color(0xFF3B82F6)),
    HurufModel("C", "Ceri", "🍒", Color(0xFFEC4899)),
    HurufModel("D", "Domba", "🐑", Color(0xFF10B981)),
    HurufModel("E", "Elang", "🦅", Color(0xFFF59E0B)),
    HurufModel("F", "Foto", "📷", Color(0xFF8B5CF6)),
    HurufModel("G", "Gajah", "🐘", Color(0xFF6366F1)),
    HurufModel("H", "Harimau", "🐯", Color(0xFFF97316)),
    HurufModel("I", "Ikan", "🐟", Color(0xFF06B6D4)),
    HurufModel("J", "Jerapah", "🦒", Color(0xFFEAB308)),
    HurufModel("K", "Kucing", "🐱", Color(0xFF14B8A6)),
    HurufModel("L", "Lebah", "🐝", Color(0xFFF59E0B)),
    HurufModel("M", "Mobil", "🚗", Color(0xFFEF4444)),
    HurufModel("N", "Nanas", "🍍", Color(0xFFEAB308)),
    HurufModel("O", "Orangutan", "🦧", Color(0xFFD97706)),
    HurufModel("P", "Pisang", "🍌", Color(0xFFFACC15)),
    HurufModel("Q", "Quran", "📖", Color(0xFF10B981)),
    HurufModel("R", "Rumah", "🏡", Color(0xFF3B82F6)),
    HurufModel("S", "Sepeda", "🚲", Color(0xFF8B5CF6)),
    HurufModel("T", "Topi", "🧢", Color(0xFF06B6D4)),
    HurufModel("U", "Udang", "🦐", Color(0xFFF97316)),
    HurufModel("V", "Vas", "🏺", Color(0xFFA855F7)),
    HurufModel("W", "Wortel", "🥕", Color(0xFFEA580C)),
    HurufModel("X", "Xilofon", "🎵", Color(0xFFEC4899)),
    HurufModel("Y", "Yoyo", "🪀", Color(0xFF10B981)),
    HurufModel("Z", "Zebra", "🦓", Color(0xFF64748B))
)

@Composable
fun AlphabetScreen(
    stars: Int,
    soundManager: AndroidSoundManager,
    onBack: () -> Unit
) {
    var currentIndex by remember { mutableStateOf(0) }
    val currentItem = listHuruf[currentIndex]

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFDF4FF))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Header dengan Back Button
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Button(
                onClick = onBack,
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE2E8F0))
            ) {
                Text("⬅ Kembali", color = Color(0xFF334155), fontWeight = FontWeight.Bold)
            }
            Text("Belajar Huruf", fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Text("⭐ $stars", fontWeight = FontWeight.Bold, color = Color(0xFFD97706))
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Main Giant Card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .shadow(8.dp, RoundedCornerShape(28.dp)),
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                // Huruf Sangat Besar
                Text(
                    text = currentItem.letter,
                    fontSize = 110.sp,
                    fontWeight = FontWeight.Black,
                    color = currentItem.color
                )

                // Ilustrasi Emoji
                Text(text = currentItem.emoji, fontSize = 72.sp)

                Spacer(modifier = Modifier.height(12.dp))

                // Kata Contoh
                Text(
                    text = currentItem.word,
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1E293B)
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Tombol Suara
                Button(
                    onClick = {
                        soundManager.speak("\${currentItem.letter}. \${currentItem.word}")
                    },
                    shape = RoundedCornerShape(24.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = currentItem.color),
                    modifier = Modifier.height(56.dp)
                ) {
                    Text("🔊 Dengarkan Suara", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Navigation Prev & Next
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Button(
                onClick = {
                    if (currentIndex > 0) currentIndex--
                },
                enabled = currentIndex > 0,
                modifier = Modifier
                    .weight(1f)
                    .height(60.dp),
                shape = RoundedCornerShape(20.dp)
            ) {
                Text("◀ Sebelumnya", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.width(16.dp))

            Button(
                onClick = {
                    if (currentIndex < listHuruf.size - 1) currentIndex++
                },
                enabled = currentIndex < listHuruf.size - 1,
                modifier = Modifier
                    .weight(1f)
                    .height(60.dp),
                shape = RoundedCornerShape(20.dp)
            ) {
                Text("Berikutnya ▶", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}`,
  },
  {
    name: 'NumberScreen.kt',
    path: 'app/src/main/java/com/belajarpintar/anak/ui/screens/NumberScreen.kt',
    description: 'Materi Belajar Angka 1-10 dengan objek yang dapat dihitung',
    code: `package com.belajarpintar.anak.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.belajarpintar.anak.utils.AndroidSoundManager

data class AngkaModel(val number: Int, val word: String, val emoji: String, val color: Color)

val listAngka = listOf(
    AngkaModel(1, "Satu", "☀️", Color(0xFFF59E0B)),
    AngkaModel(2, "Dua", "🍎", Color(0xFFEF4444)),
    AngkaModel(3, "Tiga", "⭐", Color(0xFFEAB308)),
    AngkaModel(4, "Empat", "🦋", Color(0xFF8B5CF6)),
    AngkaModel(5, "Lima", "🎈", Color(0xFFEC4899)),
    AngkaModel(6, "Enam", "🌸", Color(0xFF10B981)),
    AngkaModel(7, "Tujuh", "🍊", Color(0xFFF97316)),
    AngkaModel(8, "Delapan", "🍓", Color(0xFFEF4444)),
    AngkaModel(9, "Sembilan", "🍬", Color(0xFF06B6D4)),
    AngkaModel(10, "Sepuluh", "💖", Color(0xFF3B82F6))
)

@Composable
fun NumberScreen(
    stars: Int,
    soundManager: AndroidSoundManager,
    onBack: () -> Unit
) {
    var currentIndex by remember { mutableStateOf(0) }
    val item = listAngka[currentIndex]

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF0FDF4))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Button(
                onClick = onBack,
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE2E8F0))
            ) {
                Text("⬅ Kembali", color = Color(0xFF334155), fontWeight = FontWeight.Bold)
            }
            Text("Belajar Angka", fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Text("⭐ $stars", fontWeight = FontWeight.Bold, color = Color(0xFFD97706))
        }

        Spacer(modifier = Modifier.height(16.dp))

        Card(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .shadow(8.dp, RoundedCornerShape(28.dp)),
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                // Angka Besar & Nama
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "\${item.number}",
                        fontSize = 96.sp,
                        fontWeight = FontWeight.Black,
                        color = item.color
                    )
                    Text(
                        text = item.word,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1E293B)
                    )
                }

                // Grid Objek Yang Dihitung
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(160.dp),
                    contentAlignment = Alignment.Center
                ) {
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(5),
                        horizontalArrangement = Arrangement.Center,
                        verticalArrangement = Arrangement.Center
                    ) {
                        items(List(item.number) { item.emoji }) { emoji ->
                            Text(
                                text = emoji,
                                fontSize = 36.sp,
                                modifier = Modifier.padding(4.dp)
                            )
                        }
                    }
                }

                // Tombol Suara
                Button(
                    onClick = {
                        soundManager.speak("Angka \${item.number}. \${item.word}. Ada \${item.number} objek.")
                    },
                    shape = RoundedCornerShape(24.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = item.color),
                    modifier = Modifier.height(54.dp)
                ) {
                    Text("🔊 Dengarkan & Hitung", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Navigasi Angka
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Button(
                onClick = { if (currentIndex > 0) currentIndex-- },
                enabled = currentIndex > 0,
                modifier = Modifier.weight(1f).height(60.dp),
                shape = RoundedCornerShape(20.dp)
            ) {
                Text("◀ Sebelumnya", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.width(16.dp))
            Button(
                onClick = { if (currentIndex < listAngka.size - 1) currentIndex++ },
                enabled = currentIndex < listAngka.size - 1,
                modifier = Modifier.weight(1f).height(60.dp),
                shape = RoundedCornerShape(20.dp)
            ) {
                Text("Berikutnya ▶", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}`,
  },
  {
    name: 'QuizScreen.kt',
    path: 'app/src/main/java/com/belajarpintar/anak/ui/screens/QuizScreen.kt',
    description: 'Kuis Pilihan Ganda dengan animasi perayaan & sistem bintang lokal',
    code: `package com.belajarpintar.anak.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.belajarpintar.anak.utils.AndroidSoundManager

data class QuizOptionModel(val id: String, val label: String, val visual: String)
data class QuestionModel(
    val id: Int,
    val question: String,
    val options: List<QuizOptionModel>,
    val correctId: String,
    val praise: String
)

@Composable
fun QuizScreen(
    stars: Int,
    soundManager: AndroidSoundManager,
    onAddStar: () -> Unit,
    onBack: () -> Unit
) {
    var currentQuestionIdx by remember { mutableStateOf(0) }
    var showSuccessModal by remember { mutableStateOf(false) }
    var showRetryMessage by remember { mutableStateOf(false) }

    val questions = listOf(
        QuestionModel(
            1,
            "Mana yang merupakan warna Merah?",
            listOf(
                QuizOptionModel("a", "Biru", "🔵"),
                QuizOptionModel("b", "Merah", "🔴"),
                QuizOptionModel("c", "Kuning", "🟡")
            ),
            "b",
            "Hebat! Itu adalah warna Merah!"
        ),
        QuestionModel(
            2,
            "Hewan mana yang bersuara Meong?",
            listOf(
                QuizOptionModel("a", "Kucing", "🐱"),
                QuizOptionModel("b", "Sapi", "🐮"),
                QuizOptionModel("c", "Ayam", "🐔")
            ),
            "a",
            "Pintar Sekali! Kucing bersuara meong!"
        )
    )

    val currentQ = questions[currentQuestionIdx % questions.size]

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFFFBEB))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Button(
                onClick = onBack,
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE2E8F0))
            ) {
                Text("⬅ Beranda", color = Color(0xFF334155), fontWeight = FontWeight.Bold)
            }
            Text("Kuis Ceria", fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Text("⭐ $stars", fontWeight = FontWeight.Bold, color = Color(0xFFD97706))
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Question Card
        Card(
            modifier = Modifier.fillMaxWidth().shadow(6.dp, RoundedCornerShape(24.dp)),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("Pertanyaan:", fontSize = 16.sp, color = Color.Gray)
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = currentQ.question,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1E293B)
                )
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = { soundManager.speak(currentQ.question) },
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Text("🔊 Dengarkan Soal")
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Pilihan Jawaban
        currentQ.options.forEach { option ->
            Button(
                onClick = {
                    if (option.id == currentQ.correctId) {
                        soundManager.playSuccess()
                        soundManager.speak("Hebat! Jawabanmu benar!")
                        onAddStar()
                        showSuccessModal = true
                        showRetryMessage = false
                    } else {
                        soundManager.playTryAgain()
                        soundManager.speak("Coba lagi ya, kamu pasti bisa!")
                        showRetryMessage = true
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(68.dp)
                    .padding(vertical = 4.dp),
                shape = RoundedCornerShape(20.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.White)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(option.visual, fontSize = 32.sp)
                    Spacer(modifier = Modifier.width(16.dp))
                    Text(
                        option.label,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1E293B)
                    )
                }
            }
        }

        if (showRetryMessage) {
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                "✨ Coba lagi ya, kamu pasti bisa!",
                color = Color(0xFFD97706),
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp
            )
        }

        // Dialog Sukses
        if (showSuccessModal) {
            AlertDialog(
                onDismissRequest = { },
                title = { Text("🎉 Hebat Sekali!", fontWeight = FontWeight.Bold) },
                text = { Text("Kamu dapat +1 Bintang ⭐! Terus semangat belajar!") },
                confirmButton = {
                    Button(
                        onClick = {
                            showSuccessModal = false
                            currentQuestionIdx++
                        }
                    ) {
                        Text("Soal Berikutnya ▶")
                    }
                }
            )
        }
    }
}`,
  },
  {
    name: 'AndroidSoundManager.kt',
    path: 'app/src/main/java/com/belajarpintar/anak/utils/AndroidSoundManager.kt',
    description: 'Integrasi Text-To-Speech Android dan SoundPool untuk efek suara ceria',
    code: `package com.belajarpintar.anak.utils

import android.content.Context
import android.media.AudioAttributes
import android.media.SoundPool
import android.speech.tts.TextToSpeech
import java.util.Locale

class AndroidSoundManager(context: Context) : TextToSpeech.OnInitListener {
    private var tts: TextToSpeech? = TextToSpeech(context, this)
    private var isTtsReady = false

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts?.setLanguage(Locale("id", "ID"))
            tts?.setPitch(1.15f) // Nada suara ramah anak
            tts?.setSpeechRate(0.9f) // Kecepatan jelas untuk anak
            isTtsReady = true
        }
    }

    fun speak(text: String) {
        if (isTtsReady) {
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "UtteranceId")
        }
    }

    fun playClick() {
        // Mainkan SFX klik
    }

    fun playSuccess() {
        // Mainkan SFX perayaan benar
    }

    fun playTryAgain() {
        // Mainkan SFX lembut coba lagi
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
    }
}`,
  },
  {
    name: 'StarDataStore.kt',
    path: 'app/src/main/java/com/belajarpintar/anak/data/StarDataStore.kt',
    description: 'Penyimpanan lokal Bintang menggunakan Android Jetpack DataStore (offline & tanpa login)',
    code: `package com.belajarpintar.anak.data

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch

private val Context.dataStore by preferencesDataStore(name = "belajar_pintar_stars")

class StarDataStore(private val context: Context) {
    private val scope = CoroutineScope(Dispatchers.IO)
    private val STARS_KEY = intPreferencesKey("child_stars_count")

    val starsFlow: Flow<Int> = context.dataStore.data.map { preferences ->
        preferences[STARS_KEY] ?: 5 // Starter bonus 5 bintang
    }

    fun incrementStar() {
        scope.launch {
            context.dataStore.edit { preferences ->
                val current = preferences[STARS_KEY] ?: 5
                preferences[STARS_KEY] = current + 1
            }
        }
    }
}`,
  },
  {
    name: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    description: 'Konfigurasi Gradle Android dengan Jetpack Compose & Material 3',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.belajarpintar.anak"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.belajarpintar.anak"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation("androidx.navigation:navigation-compose:2.8.5")
    implementation("androidx.datastore:datastore-preferences:1.1.2")
}`,
  },
];
