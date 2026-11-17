package in.ayurzenix.app.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ListenerRegistration

class AdminViewModel : ViewModel() {

    private val db = FirebaseFirestore.getInstance()
    private var statsListener: ListenerRegistration? = null
    private var configListener: ListenerRegistration? = null

    private val _stats = MutableLiveData<Map<String, Any>>()
    val stats: LiveData<Map<String, Any>> = _stats

    private val _config = MutableLiveData<Map<String, Any>>()
    val config: LiveData<Map<String, Any>> = _config

    init {
        startListening()
    }

    private fun startListening() {
        // Listen to dashboard stats
        statsListener = db.collection("dashboard_stats").document("current")
            .addSnapshotListener { snapshot, e ->
                if (e != null) return@addSnapshotListener
                if (snapshot != null && snapshot.exists()) {
                    _stats.value = snapshot.data
                }
            }

        // Listen to app config
        configListener = db.collection("app_config").document("settings")
            .addSnapshotListener { snapshot, e ->
                if (e != null) return@addSnapshotListener
                if (snapshot != null && snapshot.exists()) {
                    _config.value = snapshot.data
                }
            }
    }

    fun updateFeatureStatus(featureId: String, enabled: Boolean) {
        val features = (_config.value?.get("features") as? Map<String, Any>)?.toMutableMap() ?: mutableMapOf()
        val featureConfig = (features[featureId] as? Map<String, Any>)?.toMutableMap() ?: mutableMapOf()
        featureConfig["enabled"] = enabled
        features[featureId] = featureConfig
        
        db.collection("app_config").document("settings")
            .update("features", features)
    }

    fun updatePremiumPrice(price: Int) {
        val pricing = (_config.value?.get("pricing") as? Map<String, Any>)?.toMutableMap() ?: mutableMapOf()
        pricing["premium_subscription"] = price
        
        db.collection("app_config").document("settings")
            .update("pricing", pricing)
    }

    fun sendBroadcastMessage(message: String) {
        db.collection("app_config").document("settings")
            .update("broadcast_message", message)
    }

    override fun onCleared() {
        super.onCleared()
        statsListener?.remove()
        configListener?.remove()
    }
}
