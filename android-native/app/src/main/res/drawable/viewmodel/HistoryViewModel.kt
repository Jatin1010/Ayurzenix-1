package in.ayurzenix.app.viewmodel

import android.app.Application
import androidx.lifecycle.*
import in.ayurzenix.app.data.AppDatabase
import in.ayurzenix.app.data.HistoryRepository
import in.ayurzenix.app.model.HealthResult
import kotlinx.coroutines.launch

class HistoryViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: HistoryRepository
    val allResults: LiveData<List<HealthResult>>

    init {
        val dao = AppDatabase.getDatabase(application).healthResultDao()
        repository = HistoryRepository(dao)
        allResults = repository.allResults.asLiveData()
    }

    fun deleteResult(result: HealthResult) {
        viewModelScope.launch {
            repository.deleteResult(result)
        }
    }
}
