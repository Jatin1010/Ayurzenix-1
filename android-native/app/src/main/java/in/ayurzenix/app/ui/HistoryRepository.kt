package in.ayurzenix.app.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import in.ayurzenix.app.model.HealthResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.tasks.await

class HistoryRepository(private val healthResultDao: HealthResultDao) {

    val allResults: Flow<List<HealthResult>> = healthResultDao.getAllResults()

    suspend fun saveResult(result: HealthResult) {
        // Always save locally first
        healthResultDao.insertResult(result)

        // If logged in, sync to Firestore
        val user = FirebaseAuth.getInstance().currentUser
        if (user != null) {
            try {
                val firestore = FirebaseFirestore.getInstance()
                val resultWithUser = result.copy(userId = user.uid)
                firestore.collection("users")
                    .document(user.uid)
                    .collection("history")
                    .add(resultWithUser)
                    .await()
            } catch (e: Exception) {
                // Log error or handle retry logic
                e.printStackTrace()
            }
        }
    }

    suspend fun deleteResult(result: HealthResult) {
        healthResultDao.deleteResult(result)
        
        val user = FirebaseAuth.getInstance().currentUser
        if (user != null) {
            // Logic to delete from Firestore would go here
            // For simplicity, we'll focus on local deletion for now
        }
    }
}
