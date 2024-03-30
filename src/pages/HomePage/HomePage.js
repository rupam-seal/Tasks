import React, {useState, useRef} from 'react';
import {
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Animated,
  PanResponder,
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';

const HomePage = () => {
  const [tasks, setTasks] = useState([
    {id: 1, title: 'Task 1'},
    {id: 2, title: 'Task 2'},
    {id: 3, title: 'Task 3'},
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [swipedTask, setSwipedTask] = useState(null);
  const [newTask, setNewTask] = useState('');
  const swipeThreshold = -100;
  const inputRef = useRef(null);

  const handleDelete = taskId => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleSearch = text => {
    setSearchQuery(text);
  };

  const handleSwipe = taskId => {
    setSwipedTask(taskId);
    Animated.timing(swipedTaskAnim[taskId], {
      toValue: swipeThreshold,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      handleDelete(taskId);
      setSwipedTask(null);
      swipedTaskAnim[taskId].setValue(0);
    });
  };

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    setTasks([...tasks, {id: newId, title: newTask}]);
    setNewTask('');
    Keyboard.dismiss();
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const swipedTaskAnim = {};
  const panResponders = {};

  filteredTasks.forEach(task => {
    swipedTaskAnim[task.id] = new Animated.Value(0);

    panResponders[task.id] = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        swipedTaskAnim[task.id].setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < swipeThreshold) {
          handleSwipe(task.id);
        } else {
          Animated.spring(swipedTaskAnim[task.id], {
            toValue: 0,
            bounciness: 10,
            useNativeDriver: true,
          }).start();
        }
      },
    });
  });

  const renderTaskItem = ({item}) => {
    const rowStyles = [
      styles.taskRow,
      {
        transform: [
          {
            translateX: swipedTaskAnim[item.id],
          },
        ],
      },
    ];

    return (
      <Animated.View style={rowStyles} {...panResponders[item.id].panHandlers}>
        <TouchableOpacity
          style={styles.taksContainer}
          onPress={() => handleSwipe(item.id)}>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.taskText}>{item.title}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      style={styles.section}
      colors={['#FFFFFF', '#BEC9FF']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.topbarText}>Tasks</Text>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Add new task"
              onChangeText={setNewTask}
              value={newTask}
              placeholderTextColor={'rgba(0, 0, 0, 0.3)'}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Search Tasks"
            onChangeText={handleSearch}
            value={searchQuery}
            placeholderTextColor={'rgba(0, 0, 0, 0.3)'}
          />
          <Text style={styles.taskTitle}>Items</Text>
          <FlatList
            data={filteredTasks}
            renderItem={renderTaskItem}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  section: {
    width: '100%',
    height: '100%',
  },
  container: {
    width: '100%',
    height: '100%',
  },
  topbarText: {
    padding: 20,
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    color: '#000000',
  },
  addButton: {
    backgroundColor: 'rgba(70, 99, 255, 1)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskRow: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    transform: [{translateX: 0}],
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
  },
  taskText: {
    color: 'rgba(0, 0, 0, 0.7)',
  },
  taskTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  taksContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: 'white',
  },
});
