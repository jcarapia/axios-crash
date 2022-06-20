// AXIOS GLOBALS 
axios.defaults.headers.common['X-Auth-Token'] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// GET REQUEST
function getTodos() {
  console.log('GET Request');
  // axios({
  //   method: 'get',
  //   url: 'https://jsonplaceholder.typicode.com/todos',
  //   params: {
  //     _limit: 5
  //   }
  // })

  // axios.get('https://jsonplaceholder.typicode.com/todos')

  // axios.get('https://jsonplaceholder.typicode.com/todos', { params: {_limit: 5} })
    
  axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5', {timeout: 5})
  .then(res => showOutput(res))
  .catch(err => console.log(err));
}

// POST REQUEST
function addTodo() {
  // axios({
  //   method: 'post',
  //   url: 'https://jsonplaceholder.typicode.com/todos',
  //   data: {
  //     title: "new to do",
  //     completed: false
  //   }
  // })

  //axios.post('https://jsonplaceholder.typicode.com/todos', {data: {title: "new to do", completed: false}})

  axios.post('https://jsonplaceholder.typicode.com/todos', {
    title: "new to do", 
    completed: false
  })
    .then(res => showOutput(res))
    .catch(err => console.log(err))

}

// PUT/PATCH REQUEST
function updateTodo() {
  console.log('PUT/PATCH Request');

  axios({
    method: 'patch',
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    data: {
      title: 'change the todo',
      completed: true,
    }
  })
    .then(res => showOutput(res))
    .then(err => console.log(err))
}

// DELETE REQUEST
function removeTodo() {
  console.log('DELETE Request');
  axios.delete('https://jsonplaceholder.typicode.com/todos/1')
    .then(res => showOutput(res))
    .catch(err => console.log(err)) 
}

// SIMULTANEOUS DATA
//Axios concurrent requests are deprecated - use Promise.all instead

function getData() {
  console.log('Simultaneous Request');
  axios.all([
    axios.get('https://jsonplaceholder.typicode.com/todos', {
      params: {
        _limit: 5
      }
    }),
    axios.get('https://jsonplaceholder.typicode.com/postsx', {
      params: {
        _limit: 5
      }
    })
  ])
    .then(res => {
      console.log(res);
      showOutput(res[1])
    })
    .catch(err => console.log(err))  

}

// CUSTOM HEADERS
function customHeaders() {

  // The config object is the third parameter when calling axios
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'sometoken'
    }
  }

  axios.post(
    'https://jsonplaceholder.typicode.com/todos', {
      title: 'new todo',
      completed: false
    },
    config
  )
  .then(res => showOutput(res))
  .catch(err => console.log(err))
  console.log('Custom Headers');
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  console.log('Transform Response');
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'Hello world'
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase();
      return data;
    })
  }

  axios(options).then(res => showOutput(res)).catch(err => console.log(err));
}

// ERROR HANDLING
function errorHandling() {
  console.log('Error Handling');
  axios.get('https://jsonplaceholder.typicode.com/todox?_limit=5', {
    validateStatus: function(status) {
      return status < 500 // Reject only if status is greater or equal to 500
      // With this we get a response back even with the error being thrown. 
      // However, the data will be an empty object: {}
    }
  })
    .then(res => showOutput(res))
    .catch(err => {
      if (err.response) {
        // Server respnds with status other than the 200 range 
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)

      }
    })

   
}

// CANCEL TOKEN
function cancelToken() {
  console.log('Cancel Token');

  const source = axios.CancelToken.source();

  axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5', {
    cancelToken: source.token
  })
    .then(res => showOutput(res))
    .catch(thrown => {
      if(axios.isCancel(thrown)) {
        console.log('Request cancelled', thrown.message)
      }
    })

    if (true) {
      source.cancel('Request cancelled')
    }
}

// INTERCEPTING REQUESTS & RESPONSES

// AXIOS INSTANCES
const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
})

//axiosInstance.get('/comments?_limit=5').then(res => showOutput(res))

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
