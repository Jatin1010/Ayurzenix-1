package in.ayurzenix.app.data

import androidx.room.*
import in.ayurzenix.app.model.HealthResult
import kotlinx.coroutines.flow.Flow

@Dao
interface HealthResultDao {
    @Query("SELECT * FROM health_results ORDER BY date DESC")
    fun getAllResults(): Flow<List<HealthResult>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertResult(result: HealthResult)

    @Delete
    suspend fun deleteResult(result: HealthResult)

    @Query("DELETE FROM health_results WHERE id = :id")
    suspend fun deleteById(id: Long)
}

@Database(entities = [HealthResult::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun healthResultDao(): HealthResultDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: android.content.Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "ayurzenix_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
