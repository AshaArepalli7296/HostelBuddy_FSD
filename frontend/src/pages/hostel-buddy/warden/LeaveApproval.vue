<template>
  <Navbar_warden/>
  <div class="leave-approval-container">
    <h2 class="approval-title">Leave Approval Requests</h2>
    <div class="leave-approval-content">
      <div class="requests-section">
        <div v-if="leaveRequests.length > 0">
        <div 
          v-for="(request, index) in leaveRequests" 
          :key="request.id"
          class="leave-request"
          :class="{
            'approved': request.status === 'approved',
            'rejected': request.status === 'rejected'
          }">
          <div class="request-info">
          <!-- <h3>{{ request.studentName }}</h3> -->
          <p><strong>Name :</strong> {{ request.studentName }}</p>
          <!-- <p><strong>Room No :</strong> {{ request.roomNumber }}</p> -->
          <p><strong>From :</strong> {{ request.startDate }}  <strong> To:</strong> {{ request.endDate }}</p>
          <p><strong>Reason :</strong> {{ request.reason }}</p>
          <p><strong>Contact :</strong> {{ request.emergencyContact }}</p>
          </div>
           
          <div class="request-actions">
            <template v-if="request.status === 'pending'">
              <button class="approve-btn" @click="approveLeave(index)">Approve</button></br>
              <button class="reject-btn" @click="rejectLeave(index)">Reject</button>
            </template>
            <div v-else class="status-display">
              {{ request.status.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-requests-message">No leave requests found.</div>
      </div>
      
      
      <!-- <div class="approval-image">
        <img src="@/assets/images/approve&reject.jpg" alt="Approval Status Illustration">
      </div> -->
    </div>
  </div>
  <Footer/>
</template>

<script>
import Navbar_warden from '../../../components/Navbar_warden.vue';
import Footer from '../../../components/Footer.vue';
import axios from 'axios';

export default {
  name: 'LeaveApproval',
  components: {
    Navbar_warden, Footer
  },
  data() {
    return {
      leaveRequests: []
    };
  },
  methods: {
    async fetchPendingLeaves() {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/leave/pending', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        // Format data for display
        this.leaveRequests = response.data.map((leave) => ({
      id: leave._id,
      studentName: leave?.studentName || 'Unknown',
      roomNumber: leave?.roomNumber || 'N/A',
      startDate: leave?.startDate.slice(0, 10),
      endDate: leave?.endDate.slice(0, 10),
      reason: leave?.reason,
      emergencyContact: leave?.emergencyContact,
      status: leave?.status
        }));
      }  
      catch (err) {
         console.error('Failed to fetch leave requests:', err.response?.data || err.message);
         alert('Error fetching leave requests');
     }
    },
    async approveLeave(index) {
      await this.updateLeaveStatus(index, 'approved');
    },
    async rejectLeave(index) {
      await this.updateLeaveStatus(index, 'rejected');
    },
    async updateLeaveStatus(index, status) {
      try {
        const leaveId = this.leaveRequests[index].id;
        await axios.put(`http://localhost:5000/api/v1/leave/${leaveId}/status`, {
          status
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.leaveRequests[index].status = status;
         this.fetchPendingLeaves();
      } catch (err) {
        console.error(`Failed to ${status} leave:`, err);
        alert(`Error while ${status}ing leave`);
      }
    }
  },
  mounted() {
    this.fetchPendingLeaves();
  }
}
</script>


<style scoped>
.leave-approval-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-bottom: 140px;
}

.approval-title {
  color: #1BBC9B;
  padding-bottom: 10px;
  border-bottom: 3px solid #1BBC9B;
  margin-bottom: 25px;
  font-size: 35px;
  text-align: center;
}
.approval-title{
 padding-bottom: 10px;
  border-bottom: 3px solid #1BBC9B;
  margin-bottom: 25px;
  width:800px;
}
.leave-approval-content {
  display: flex;
  gap: 30px;
}
 
.requests-section {
  flex: 2;
}

.approval-image {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20px;
}

.approval-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
 .leave-request {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  border-left: 5px solid transparent;
  transition: all 0.3s ease;
  line-height: 20px;
}

 .request-info {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Adjust this value for spacing between lines */
}

.request-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 30px;
  justify-content: center;
}

.leave-request.approved {
  border-left-color: #1BBC9B;
}

.leave-request.rejected {
  border-left-color: #e74c3c;
}

.request-info {
  flex: 1;
}

.request-info h3 {
  margin-top: 0;
  color: #2c3e50;
}

.request-info p {
  margin: 5px 0;
  color: #555;
  white-space: nowrap;
  font-size: 18px;
}

.approve-btn, .reject-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.approve-btn {
  color: #1BBC9B;
  border:2px solid #1BBC9B;
  background-color: #fff;
  font-size: 17px;
  margin-right: 40px;
  border-radius: 10px;
  max-width: fit-content;
  margin: 0 10px;
}

.approve-btn:hover {
  background-color: #16a085;
  color:white;
}

.reject-btn {
  color: #fa2929;
  border:2px solid #fa2929;
  background-color: #fff;
  font-size: 17px;
  margin-right: 40px;
  border-radius: 10px;
  width:100px;
  margin-left: 10px;
}

.reject-btn:hover {
  background-color: #c0392b;
  color:white;
}

.status-display {
  padding: 8px 15px;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.leave-request.approved .status-display {
  color: #1BBC9B;
  background-color: rgba(27, 188, 155, 0.1);
}

.leave-request.rejected .status-display {
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
}

@media (max-width: 768px) {
  .leave-approval-content {
    flex-direction: column;
  }
  
  .approval-image {
    order: -1;
    margin-bottom: 20px;
  }
  
  .approval-image img {
    max-width: 300px;
    position: sticky;
    top: 20px; /* Add this - adjust as needed */
    align-self: flex-start; /* Add this */
    height: 100vh;
  }
}

.no-requests-message {
  text-align: center;
  font-size: 20px;
  color: #888;
  margin-top: 50px;
  margin-bottom: 40px;
}

</style>