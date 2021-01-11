<template>
  <div>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Confirm cancel?</h3>
          </div>
          <div class="btn-group">
            <button class="btn" @click="$emit('hideCancelPopup', 'correctCancel')">Yes</button>
            <button class="btn" @click="$emit('hideCancelPopup', 'continueCorrect')">No</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "correct-about-element-cancel-popup"
    }
</script>

<style scoped>
  button {
    padding: 12px 23px;
    border-radius: 25px;
    background-color: #42b983;
    border: none;
    color: white;
    font-weight: bold;
    margin: 10px;
    cursor: pointer;
  }
  button:focus {
    outline: none;
  }
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s ease;
  }

  .modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }
</style>
