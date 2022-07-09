import psutil

def getStats():
    # Get cpu statistics
    cpu_percent = str(psutil.cpu_percent()) + '%'
    base_speed = psutil.cpu_freq(percpu=False).current
    cpu_info = 'base speed: ' + str(base_speed/1000) + 'GHz'

    # Calculate memory information
    memory = psutil.virtual_memory()
    # Convert Bytes to MB (Bytes -> KB -> MB)
    available = round(memory.available/1024.0/1024.0,1)
    total = round(memory.total/1024.0/1024.0,1)
    mem_percent = str(memory.percent) + '%'
    mem_info = str(available) + 'MB free / ' + str(total) + 'MB'

    # Calculate disk information
    disk = psutil.disk_usage('/')
    # Convert Bytes to GB (Bytes -> KB -> MB -> GB)
    free = round(disk.free/1024.0/1024.0/1024.0,1)
    total = round(disk.total/1024.0/1024.0/1024.0,1)
    disk_percent = str(disk.percent) + '%'
    disk_info = str(free) + 'GB free / ' + str(total) + 'GB'

    return  [
            {'name': 'cpu','shortDescription': cpu_percent, 'longDescription': cpu_info}, 
            {'name': 'memory','shortDescription': mem_percent, 'longDescription': mem_info}, 
            {'name': 'disk','shortDescription': disk_percent, 'longDescription': disk_info}, 
        ]

    