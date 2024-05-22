# 1. 가상 환경 생성
python -m venv venv

# 2. 가상 환경 활성화 (Windows 환경, cmd나 git bash에서)
.\myvenv\Scripts\activate
정상적으로 활성화 시 가상환경 진입: (myvenv)

# 3. 의존성 설치 (myvenv)
pip install -r requirements.txt

# 4. Django 실행 (manage.py 위치에서)
py manage.py runserver
정상적으로 실행 시: 
Django version 4.2, using settings 'back_jango.settings'
Starting development server at http://127.0.0.1:8000/

# 5. 패키지 최신화 (myvenv)
pip freeze > requirements.txt

# 6. MySQL 데이터베이스 연동 (manage.py 위치에서)
py manage.py makemigrations
py manage.py migrate

# 7. 가상 환경 비활성화
deactivate

# 8. 기존 모델 수정시
1) ~/travel/migrations/에서 __init__.py를 제외한 모든 파일 삭제
2) db.sqlite3 파일 삭제
3) 새 스키마 생성: 6번 실행