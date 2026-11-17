package in.ayurzenix.app.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.io.Serializable

@Entity(tableName = "health_results")
data class HealthResult(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val featureType: String,
    val conditionName: String,
    val symptoms: String,
    val date: Long, // Timestamp
    val fullResult: String,
    val userId: String? = null // For syncing with Firebase
) : Serializable
