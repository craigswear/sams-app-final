import styles from './page.module.css';

export default function ClassPage() {
  return (
    <main className={styles.mainContent}>
      <a href="/dashboard/classes" className={styles.backLink}>&larr; Back to My Classes</a>
      
      <div className={styles.pageHeader}>
          <h1>Class: Algebra I</h1>
      </div>

      {/* Student Roster Table */}
      <div className={styles.tableContainer}>
          <h2>Student Roster</h2>
          <table>
              <thead>
                  <tr>
                      <th>Name</th>
                      <th>Student ID</th>
                      <th>Accommodations</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>Jane Smith</td>
                      <td>333444</td>
                      <td>Read Aloud</td>
                      <td><button className={styles.actionButton}>View / Log</button></td>
                  </tr>
                  <tr>
                      <td>Mary Williams</td>
                      <td>777888</td>
                      <td>Preferential Seating</td>
                      <td><button className={styles.actionButton}>View / Log</button></td>
                  </tr>
                  <tr>
                      <td>Peter Jones</td>
                      <td>555666</td>
                      <td>Extended Time, Frequent Breaks, Use of Visual Aids</td>
                      <td><button className={styles.actionButton}>View / Log</button></td>
                  </tr>
              </tbody>
          </table>
      </div>

      {/* Recent Log Entries Table */}
      <div className={styles.tableContainer}>
          <h2>Recent Accommodation Log Entries</h2>
          <table>
              <thead>
                  <tr>
                      <th>Date</th>
                      <th>Student</th>
                      <th>Accommodation Logged</th>
                      <th>Logged By</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>2025-06-16</td>
                      <td>Peter Jones</td>
                      <td>Extended Time (Quiz 3)</td>
                      <td>Mr. Harrison</td>
                  </tr>
                   <tr>
                      <td>2025-06-15</td>
                      <td>Jane Smith</td>
                      <td>Read Aloud (Chapter 5 Reading)</td>
                      <td>Mr. Harrison</td>
                  </tr>
                  <tr>
                      <td>2025-06-12</td>
                      <td>Mary Williams</td>
                      <td>Preferential Seating (Unit Lecture)</td>
                      <td>Mr. Harrison</td>
                  </tr>
              </tbody>
          </table>
      </div>
    </main>
  );
}
