package in.ayurzenix.app.ui

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// --- Theme Colors ---
val AyurGreen = Color(0xFF22C55E)
val AyurDarkGreen = Color(0xFF16A34A)
val AyurBackground = Color(0xFFF8FBF9)
val CardSurface = Color(0xFFFFFFFF)
val TextPrimary = Color(0xFF1F2937)
val TextSecondary = Color(0xFF6B7280)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OptimizedInputScreen() {
    var currentStep by remember { mutableIntStateOf(1) }
    val totalSteps = 3

    // State variables for inputs
    var selectedLifestyle by remember { mutableStateOf("") }
    var sleepQuality by remember { mutableFloatStateOf(50f) }
    var stressLevel by remember { mutableStateOf("") }

    Scaffold(
        containerColor = AyurBackground,
        topBar = {
            TopAppBar(
                title = { Text("Health Scan", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    if (currentStep > 1) {
                        IconButton(onClick = { currentStep-- }) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = AyurBackground,
                    titleContentColor = TextPrimary
                )
            )
        },
        bottomBar = {
            BottomNavigationArea(
                currentStep = currentStep,
                totalSteps = totalSteps,
                onNext = { if (currentStep < totalSteps) currentStep++ else /* Submit */ {} }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 24.dp)
        ) {
            // Lightweight Progress Bar
            LinearProgressIndicator(
                progress = { currentStep.toFloat() / totalSteps },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp)),
                color = AyurGreen,
                trackColor = AyurGreen.copy(alpha = 0.1f),
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Step Content with simple crossfade for performance
            Crossfade(
                targetState = currentStep,
                animationSpec = tween(300),
                label = "step_transition"
            ) { step ->
                when (step) {
                    1 -> LifestyleStep(
                        selected = selectedLifestyle,
                        onSelect = { selectedLifestyle = it }
                    )
                    2 -> SleepStep(
                        value = sleepQuality,
                        onValueChange = { sleepQuality = it }
                    )
                    3 -> StressStep(
                        selected = stressLevel,
                        onSelect = { stressLevel = it }
                    )
                }
            }
        }
    }
}

// --- Steps ---

@Composable
fun LifestyleStep(selected: String, onSelect: (String) -> Unit) {
    StepContainer(
        title = "What is your lifestyle?",
        subtitle = "Select the option that best describes your daily activity."
    ) {
        val options = listOf("Active", "Moderate", "Sedentary")
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            options.forEach { option ->
                SelectableCard(
                    text = option,
                    isSelected = selected == option,
                    onClick = { onSelect(option) }
                )
            }
        }
    }
}

@Composable
fun SleepStep(value: Float, onValueChange: (Float) -> Unit) {
    StepContainer(
        title = "How was your sleep?",
        subtitle = "Slide to indicate your sleep quality last night."
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 24.dp)
        ) {
            val emoji = when {
                value < 33f -> "😫"
                value < 66f -> "😐"
                else -> "😴"
            }
            val label = when {
                value < 33f -> "Poor"
                value < 66f -> "Average"
                else -> "Excellent"
            }

            Text(text = emoji, fontSize = 64.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = label,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = AyurDarkGreen
            )
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Slider(
                value = value,
                onValueChange = onValueChange,
                valueRange = 0f..100f,
                colors = SliderDefaults.colors(
                    thumbColor = AyurGreen,
                    activeTrackColor = AyurGreen,
                    inactiveTrackColor = AyurGreen.copy(alpha = 0.2f)
                )
            )
        }
    }
}

@Composable
fun StressStep(selected: String, onSelect: (String) -> Unit) {
    StepContainer(
        title = "Current stress level?",
        subtitle = "How overwhelmed are you feeling right now?"
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            val levels = listOf("Low", "Medium", "High")
            levels.forEach { level ->
                CircularSelector(
                    label = level,
                    isSelected = selected == level,
                    onClick = { onSelect(level) }
                )
            }
        }
    }
}

// --- Reusable UI Components ---

@Composable
fun StepContainer(title: String, subtitle: String, content: @Composable () -> Unit) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = title,
            fontSize = 28.sp,
            fontWeight = FontWeight.Black,
            color = TextPrimary,
            lineHeight = 34.sp
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = subtitle,
            fontSize = 16.sp,
            color = TextSecondary
        )
        Spacer(modifier = Modifier.height(32.dp))
        content()
    }
}

@Composable
fun SelectableCard(
    text: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    
    // Minimal scale animation
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.97f else 1f,
        animationSpec = tween(150), label = "scale"
    )

    // Smooth color transitions
    val bgColor by animateColorAsState(
        targetValue = if (isSelected) AyurGreen.copy(alpha = 0.05f) else CardSurface,
        label = "bgColor"
    )
    val borderColor by animateColorAsState(
        targetValue = if (isSelected) AyurGreen else Color(0xFFE5E7EB),
        label = "borderColor"
    )
    
    // Dynamic elevation
    val elevation by animateDpAsState(
        targetValue = if (isSelected) 8.dp else 2.dp,
        label = "elevation"
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .scale(scale)
            .shadow(
                elevation = elevation,
                shape = RoundedCornerShape(16.dp),
                spotColor = if (isSelected) AyurGreen else Color.Black.copy(alpha = 0.1f)
            )
            .clip(RoundedCornerShape(16.dp))
            .background(bgColor)
            .border(
                width = if (isSelected) 2.dp else 1.dp,
                color = borderColor,
                shape = RoundedCornerShape(16.dp)
            )
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick
            )
            .padding(20.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = text,
                color = if (isSelected) AyurDarkGreen else TextPrimary,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                fontSize = 16.sp
            )
            
            if (isSelected) {
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = "Selected",
                    tint = AyurGreen
                )
            }
        }
    }
}

@Composable
fun CircularSelector(
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.9f else if (isSelected) 1.05f else 1f,
        animationSpec = tween(150), label = "circleScale"
    )

    val bgColor by animateColorAsState(
        targetValue = if (isSelected) AyurGreen else CardSurface,
        label = "circleBg"
    )
    
    val textColor by animateColorAsState(
        targetValue = if (isSelected) Color.White else TextPrimary,
        label = "circleText"
    )

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(80.dp)
                .scale(scale)
                .shadow(
                    elevation = if (isSelected) 12.dp else 2.dp,
                    shape = CircleShape,
                    spotColor = if (isSelected) AyurGreen else Color.Black.copy(alpha = 0.1f)
                )
                .clip(CircleShape)
                .background(bgColor)
                .border(
                    width = if (isSelected) 0.dp else 1.dp,
                    color = Color(0xFFE5E7EB),
                    shape = CircleShape
                )
                .clickable(
                    interactionSource = interactionSource,
                    indication = null,
                    onClick = onClick
                )
        ) {
            Text(
                text = label,
                color = textColor,
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
            )
        }
    }
}

@Composable
fun BottomNavigationArea(
    currentStep: Int,
    totalSteps: Int,
    onNext: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                Brush.verticalGradient(
                    colors = listOf(Color.Transparent, AyurBackground),
                    startY = 0f,
                    endY = 100f
                )
            )
            .padding(24.dp)
    ) {
        Button(
            onClick = onNext,
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .shadow(8.dp, RoundedCornerShape(16.dp), spotColor = AyurGreen),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = AyurGreen)
        ) {
            Text(
                text = if (currentStep == totalSteps) "Submit" else "Continue",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.width(8.dp))
            if (currentStep < totalSteps) {
                Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(20.dp))
            } else {
                Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(20.dp))
            }
        }
    }
}
